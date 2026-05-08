package server

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/YouKnowZo/Meta_The_World/services/bridge/internal/state"
)

<<<<<<< HEAD
type GamblingEventPayload struct {
	RequestID string `json:"requestId"`
	Player    string `json:"player"`
	Won       bool   `json:"won"`
	Payout    uint64 `json:"payout"`
	GameType  string `json:"gameType"`
}

=======
>>>>>>> e76a24433985ea600e5c84e9fa8c50aa7df308f7
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // In production, implement origin check
	},
}

type WSHandler struct {
	redis *state.RedisProvider
}

func NewWSHandler(redis *state.RedisProvider) *WSHandler {
	return &WSHandler{redis: redis}
}

func (h *WSHandler) Handle(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Failed to upgrade websocket: %v", err)
		return
	}
	defer conn.Close()

	ctx, cancel := context.WithCancel(r.Context())
	defer cancel()

<<<<<<< HEAD
	var writeMu sync.Mutex // Mutex for protecting WebSocket writes

=======
	var mu sync.Mutex
>>>>>>> e76a24433985ea600e5c84e9fa8c50aa7df308f7
	subscriptions := make(map[string]context.CancelFunc)

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Printf("Websocket read error: %v", err)
			break
		}

		var msg struct {
			Type    string          `json:"type"`
			Payload json.RawMessage `json:"payload"`
		}

		if err := json.Unmarshal(message, &msg); err != nil {
<<<<<<< HEAD
			log.Printf("Failed to unmarshal websocket message: %v", err)
=======
>>>>>>> e76a24433985ea600e5c84e9fa8c50aa7df308f7
			continue
		}

		switch msg.Type {
		case "SUBSCRIBE_ZONE":
			var payload struct {
				ZoneID string `json:"zoneId"`
			}
			if err := json.Unmarshal(msg.Payload, &payload); err == nil {
<<<<<<< HEAD
				writeMu.Lock()
				if _, ok := subscriptions[payload.ZoneID]; !ok {
					zCtx, zCancel := context.WithCancel(ctx)
					subscriptions[payload.ZoneID] = zCancel
					go h.subscribeToZone(zCtx, conn, payload.ZoneID, &writeMu)
				}
				writeMu.Unlock()
			} else {
				log.Printf("Failed to unmarshal SUBSCRIBE_ZONE payload: %v", err)
			}
		case "AGENT_INTERACTION":
			log.Printf("Agent interaction received: %s", string(msg.Payload))
			// In a real implementation, this would call the ai-agent service
		case "GAMBLING_EVENT":
			var gamblingEvent GamblingEventPayload
			if err := json.Unmarshal(msg.Payload, &gamblingEvent); err == nil {
				log.Printf("Gambling event received: %+v", gamblingEvent)
				h.redis.PublishMessage(ctx, "gambling_events", msg.Payload)
			} else {
				log.Printf("Failed to unmarshal GAMBLING_EVENT payload: %v", err)
=======
				mu.Lock()
				if _, ok := subscriptions[payload.ZoneID]; !ok {
					zCtx, zCancel := context.WithCancel(ctx)
					subscriptions[payload.ZoneID] = zCancel
					go h.subscribeToZone(zCtx, conn, payload.ZoneID, &mu)
				}
				mu.Unlock()
			}
		case "AGENT_INTERACTION":
			var payload struct {
				AgentID string `json:"agentId"`
				Message string `json:"message"`
			}
			if err := json.Unmarshal(msg.Payload, &payload); err == nil {
				log.Printf("Agent %s interaction: %s", payload.AgentID, payload.Message)
				// In a real implementation, this would call the ai-agent service
			}
		case "GAMBLING_EVENT":
			var payload struct {
				Type   string `json:"type"`
				Amount string `json:"amount"`
			}
			if err := json.Unmarshal(msg.Payload, &payload); err == nil {
				log.Printf("Gambling event: %s for %s", payload.Type, payload.Amount)
				// Broadcast event to other users in the zone
>>>>>>> e76a24433985ea600e5c84e9fa8c50aa7df308f7
			}
		}
	}
}

<<<<<<< HEAD
func (h *WSHandler) subscribeToZone(ctx context.Context, conn *websocket.Conn, zoneID string, writeMu *sync.Mutex) {
=======
func (h *WSHandler) subscribeToZone(ctx context.Context, conn *websocket.Conn, zoneID string, mu *sync.Mutex) {
>>>>>>> e76a24433985ea600e5c84e9fa8c50aa7df308f7
	pubsub := h.redis.SubscribeZone(ctx, zoneID)
	defer pubsub.Close()

	ch := pubsub.Channel()
	for {
		select {
		case <-ctx.Done():
<<<<<<< HEAD
			log.Printf("Stopping subscription for zone %s: %v", zoneID, ctx.Err())
			return
		case msg := <-ch:
			var entityState map[string]interface{} // Use map to represent generic JSON for now
			if err := json.Unmarshal([]byte(msg.Payload), &entityState); err != nil {
				log.Printf("Failed to unmarshal entity state from pubsub for zone %s: %v", zoneID, err)
				continue
			}

			writeMu.Lock()
			err := conn.WriteJSON(map[string]interface{}{
				"type":    "ENTITY_STATE_UPDATE", // More specific type
				"zoneId":  zoneID,
				"payload": entityState,
			})
			writeMu.Unlock()
			if err != nil {
				log.Printf("Failed to write entity state to websocket for zone %s: %v", zoneID, err)
				return // Terminate goroutine if write fails
=======
			return
		case msg := <-ch:
			mu.Lock()
			err := conn.WriteJSON(map[string]interface{}{
				"type":    "ENTITY_STATE",
				"payload": json.RawMessage(msg.Payload),
			})
			mu.Unlock()
			if err != nil {
				return
>>>>>>> e76a24433985ea600e5c84e9fa8c50aa7df308f7
			}
		}
	}
}
