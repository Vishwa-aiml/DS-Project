import geopandas as gpd
import pandas as pd
import numpy as np
from shapely.geometry import Polygon

# Chennai approximate bounding box
# Min Longitude, Min Latitude, Max Longitude, Max Latitude
CHENNAI_BOUNDS = (79.90, 12.80, 80.40, 13.30)

def create_grid(bounds=CHENNAI_BOUNDS, grid_size_km=1.0):
    """
    Create a regular grid of polygons over the specified bounding box.
    grid_size_km is approximate (using 1 deg ~ 111 km).
    """
    minx, miny, maxx, maxy = bounds
    
    # 1 degree of latitude is approx 111.32 km
    # 1 degree of longitude at 13 degrees latitude is approx 111.32 * cos(13 deg) ~ 108 km
    deg_per_km_lat = 1 / 111.32
    deg_per_km_lon = 1 / (111.32 * np.cos(np.radians((miny + maxy) / 2)))
    
    step_lat = grid_size_km * deg_per_km_lat
    step_lon = grid_size_km * deg_per_km_lon
    
    # Generate grid coordinates
    lon_points = np.arange(minx, maxx, step_lon)
    lat_points = np.arange(miny, maxy, step_lat)
    
    polygons = []
    grid_ids = []
    
    # Create polygons
    idx = 0
    for i in range(len(lon_points) - 1):
        for j in range(len(lat_points) - 1):
            x1 = lon_points[i]
            y1 = lat_points[j]
            x2 = lon_points[i+1]
            y2 = lat_points[j+1]
            
            # Polygon counter-clockwise
            poly = Polygon([(x1, y1), (x2, y1), (x2, y2), (x1, y2)])
            polygons.append(poly)
            grid_ids.append(f"GRID_{idx:05d}")
            idx += 1
            
    # Create GeoDataFrame
    gdf = gpd.GeoDataFrame({
        "grid_id": grid_ids,
        "geometry": polygons
    }, crs="EPSG:4326")
    
    return gdf

if __name__ == "__main__":
    import os
    grid = create_grid()
    print(f"Created a grid of {len(grid)} cells.")
    
    # Save the grid for later usage
    output_path = os.path.join(os.path.dirname(__file__), "..", "data", "chennai_grid.geojson")
    try:
        grid.to_file(output_path, driver="GeoJSON")
        print(f"Saved grid to {output_path}")
    except Exception as e:
        print(f"Could not save grid, make sure data/ folder exists: {e}")
