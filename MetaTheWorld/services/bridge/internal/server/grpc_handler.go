package server

import (
	"context"
<<<<<<< HEAD
	"encoding/json"
=======
>>>>>>> e76a24433985ea600e5c84e9fa8c50aa7df308f7
	"io"
	"log"

	pb "github.com/YouKnowZo/Meta_The_World/services/bridge/proto"
	"github.com/YouKnowZo/Meta_The_World/services/bridge/internal/spatial"
	"github.com/YouKnowZo/Meta_The_World/services/bridge/internal/state"
<<<<<<< HEAD
	"google.golang.org/protobuf/types/known/timestamppb"
=======
>>>>>>> e76a24433985ea600e5c84e9fa8c50aa7df308f7
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

<<<<<<< HEAD
			// 3. Send back all entities in the same zone to the client (for simplicity)
			allEntities, err := s.redis.GetAllEntityStates(ctx)
			if err != nil {
				log.Printf("Failed to get all entity states: %v", err)
				continue
			}

			entityBatch := &pb.EntityBatch{
				Entities: allEntities,
			}

			err = stream.Send(entityBatch)
			if err != nil {
				log.Printf("Failed to send entity batch: %v", err)
				return err
			}
=======
			// Note: In a real implementation, we would also send back nearby entities
			// to the client on this stream. For now, we just acknowledge.
>>>>>>> e76a24433985ea600e5c84e9fa8c50aa7df308f7
		}
	}
}

func (s *BridgeServer) SubscribeEvents(req *pb.SubscribeRequest, stream pb.BridgeService_SubscribeEventsServer) error {
	ctx := stream.Context()
<<<<<<< HEAD

=======
	
>>>>>>> e76a24433985ea600e5c84e9fa8c50aa7df308f7
	// Subscribe to each requested zone in Redis
	for _, zoneID := range req.ZoneIds {
		go func(zID string) {
			pubsub := s.redis.SubscribeZone(ctx, zID)
			defer pubsub.Close()
<<<<<<< HEAD

=======
			
>>>>>>> e76a24433985ea600e5c84e9fa8c50aa7df308f7
			ch := pubsub.Channel()
			for {
				select {
				case <-ctx.Done():
<<<<<<< HEAD
					log.Printf("SubscribeEvents goroutine for zone %s closed: %v", zID, ctx.Err())
					return
				case msg := <-ch:
					var entityState pb.EntityState
					err := json.Unmarshal([]byte(msg.Payload), &entityState)
					if err != nil {
						log.Printf("Failed to unmarshal entity state from pubsub: %v", err)
						continue
					}
					
					// Broadcast event to client
					err = stream.Send(&pb.WorldEvent{
						EventId:   entityState.EntityId, // Using entity ID as event ID for simplicity
						EventType: "ENTITY_UPDATE",
						ZoneId:    zID,
						Payload:   []byte(msg.Payload), // Send original payload for now
						Timestamp: timestamppb.Now(),
					})
					if err != nil {
						log.Printf("Failed to send WorldEvent to client: %v", err)
						return
					}
=======
					return
				case msg := <-ch:
					// Broadcast event to client
					stream.Send(&pb.WorldEvent{
						EventType: "ENTITY_UPDATE",
						ZoneId:    zID,
						Payload:   []byte(msg.Payload),
					})
>>>>>>> e76a24433985ea600e5c84e9fa8c50aa7df308f7
				}
			}
		}(zoneID)
	}

<<<<<<< HEAD
	// Keep the stream open until context is done
	<-ctx.Done()
	log.Printf("SubscribeEvents stream closed for zone: %v", req.ZoneIds)
=======
	<-ctx.Done()
>>>>>>> e76a24433985ea600e5c84e9fa8c50aa7df308f7
	return ctx.Err()
}
