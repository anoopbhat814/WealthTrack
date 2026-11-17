FROM golang:1.22-alpine AS build
WORKDIR /src
COPY services/marketdata .
RUN go build -o /out/ingestd ./cmd/ingestd && go build -o /out/alertd ./cmd/alertd

FROM alpine:3.19
COPY --from=build /out /usr/local/bin
CMD ["ingestd"]
