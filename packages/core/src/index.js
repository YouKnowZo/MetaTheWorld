"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandRegistry = exports.GPSUtils = void 0;
// Entry point for shared types and utilities
__exportStar(require("../types"), exports);
// Core utilities
class GPSUtils {
    static calculateDistance(pos1, pos2) {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = pos1.latitude * Math.PI / 180;
        const φ2 = pos2.latitude * Math.PI / 180;
        const Δφ = (pos2.latitude - pos1.latitude) * Math.PI / 180;
        const Δλ = (pos2.longitude - pos1.longitude) * Math.PI / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    static isNearby(pos1, pos2, maxDistance = 100) {
        return this.calculateDistance(pos1, pos2) <= maxDistance;
    }
}
exports.GPSUtils = GPSUtils;
class LandRegistry {
    lands = new Map();
    addLand(land) {
        this.lands.set(land.tokenId, land);
    }
    getLand(tokenId) {
        return this.lands.get(tokenId);
    }
    getNearbyLands(position, radius = 500) {
        return Array.from(this.lands.values()).filter(land => GPSUtils.isNearby(position, { latitude: land.latitude, longitude: land.longitude }, radius));
    }
    getAllLands() {
        return Array.from(this.lands.values());
    }
}
exports.LandRegistry = LandRegistry;
