package state

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
	pb "github.com/YouKnowZo/Meta_The_World/services/bridge/proto"
)

type RedisProvider struct {
	client *redis.Client
}

func NewRedisProvider(addr string) *RedisProvider {
	rdb := redis.NewClient(&redis.Options{
		Addr: addr,
	})
	return &RedisProvider{client: rdb}
}

func (p *RedisProvider) SetEntityState(ctx context.Context, entity *pb.EntityState) error {
	data, err := json.Marshal(entity)
	if err != nil {
		return err
	}

	key := fmt.Sprintf("entity:%s", entity.EntityId)
	// Store entity state with a TTL
	return p.client.Set(ctx, key, data, 30*time.Second).Err()
}

func (p *RedisProvider) PublishUpdate(ctx context.Context, zoneID string, entity *pb.EntityState) error {
	data, err := json.Marshal(entity)
	if err != nil {
		return err
	}
	return p.client.Publish(ctx, fmt.Sprintf("channel:%s", zoneID), data).Err()
}

func (p *RedisProvider) SubscribeZone(ctx context.Context, zoneID string) *redis.PubSub {
	return p.client.Subscribe(ctx, fmt.Sprintf("channel:%s", zoneID))
}

func (p *RedisProvider) PublishMessage(ctx context.Context, channel string, message []byte) error {
	return p.client.Publish(ctx, channel, message).Err()
}

func (p *RedisProvider) GetAllEntityStates(ctx context.Context) ([]*pb.EntityState, error) {
	var entities []*pb.EntityState

	// Use SCAN to iterate over keys matching a pattern
	iter := p.client.Scan(ctx, 0, "entity:*", 0).Iterator()
	for iter.Next(ctx) {
		key := iter.Val()
		val, err := p.client.Get(ctx, key).Bytes()
		if err != nil {
			return nil, err
		}

		var entity pb.EntityState
		if err := json.Unmarshal(val, &entity); err != nil {
			return nil, err
		}
		entities = append(entities, &entity)
	}
	if err := iter.Err(); err != nil {
		return nil, err
	}

	return entities, nil
}
