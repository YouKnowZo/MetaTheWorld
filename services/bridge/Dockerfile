FROM golang:1.24-alpine AS builder

WORKDIR /app

# Install dependencies for protoc if needed, but we already have the generated files
RUN apk add --no-cache protobuf-dev

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o bridge-service main.go

FROM alpine:latest

WORKDIR /root/

COPY --from=builder /app/bridge-service .

EXPOSE 50051
EXPOSE 8080

CMD ["./bridge-service"]
