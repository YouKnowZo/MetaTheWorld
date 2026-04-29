package spatial

import (
	"fmt"
	"github.com/golang/geo/s2"
)

// S2Manager handles spatial partitioning using S2 cells
type S2Manager struct {
	Level int
}

func NewS2Manager(level int) *S2Manager {
	if level == 0 {
		level = 12 // Default level, ~3-6 km2
	}
	return &S2Manager{Level: level}
}

// LatLonToCellID converts coordinates to an S2 cell ID string
func (m *S2Manager) LatLonToCellID(lat, lon float64) string {
	latlng := s2.LatLngFromDegrees(lat, lon)
	cellID := s2.CellIDFromLatLng(latlng).Parent(m.Level)
	return cellID.ToToken()
}

// GetNeighborCells returns the tokens for the neighbors of the given cell
func (m *S2Manager) GetNeighborCells(lat, lon float64) []string {
	latlng := s2.LatLngFromDegrees(lat, lon)
	cellID := s2.CellIDFromLatLng(latlng).Parent(m.Level)
	
	neighbors := cellID.AllNeighbors(m.Level)
	tokens := make([]string, len(neighbors)+1)
	tokens[0] = cellID.ToToken()
	for i, neighbor := range neighbors {
		tokens[i+1] = neighbor.ToToken()
	}
	return tokens
}

func (m *S2Manager) GetZoneID(lat, lon float64) string {
	return fmt.Sprintf("zone:%s", m.LatLonToCellID(lat, lon))
}
