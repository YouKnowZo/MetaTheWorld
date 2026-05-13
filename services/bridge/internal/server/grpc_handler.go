package server

import (
	"context"
	"io"
	"log"

	pb "github.com/YouKnowZo/Meta_The_World/services/bridge/proto"
	"github.com/YouKnowZo/Meta_The_World/services/bridge/internal/spatial"
	"github.com/YouKnowZo/Meta_The_World/services/bridge/internal/state"
)

type BridgeServer struct {
	pb.UnimplementedBridgeServiceServer
	redis     *state.RedisProvider
	s2Manager *spatial.S2Manager
}

func NewBridgeServer(redis *state.RedisProvider, s2 *spatial.S2Manager) *BridgeServer {
	return &BridgeServer{
		redis:     redis,
		s2Manager: s2,
	}
}

func (s *BridgeServer) StreamEntityUpdates(stream pb.BridgeService_StreamEntityUpdatesServer) error {
	ctx := stream.Context()
	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
			state, err := stream.Recv()
			if err == io.EOF {
				return nil
			}
			if err != nil {
				return err
			}

			// 1. Update state in Redis
			err = s.redis.SetEntityState(ctx, state)
			if err != nil {
				log.Printf("Failed to set entity state: %v", err)
			}

			// 2. Determine zone and publish to Redis Pub/Sub
			zoneID := s.s2Manager.GetZoneID(state.Position.X, state.Position.Y)
			err = s.redis.PublishUpdate(ctx, zoneID, state)
			if err != nil {
				log.Printf("Failed to publish update: %v", err)
			}

			// Note: In a real implementation, we would also send back nearby entities
			// to the client on this stream. For now, we just acknowledge.
		}
	}
}

func (s *BridgeServer) SubscribeEvents(req *pb.SubscribeRequest, stream pb.BridgeService_SubscribeEventsServer) error {
	ctx := stream.Context()
	
	// Subscribe to each requested zone in Redis
	for _, zoneID := range req.ZoneIds {
		go func(zID string) {
			pubsub := s.redis.SubscribeZone(ctx, zID)
			defer pubsub.Close()
			
			ch := pubsub.Channel()
			for {
				select {
				case <-ctx.Done():
					return
				case msg := <-ch:
					// Broadcast event to client
					stream.Send(&pb.WorldEvent{
						EventType: "ENTITY_UPDATE",
						ZoneId:    zID,
						Payload:   []byte(msg.Payload),
					})
				}
			}
		}(zoneID)
	}

	<-ctx.Done()
	return ctx.Err()
}
