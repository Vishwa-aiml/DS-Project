import geopandas as gpd
import pandas as pd
import numpy as np
import os

def generate_static_features(grid_path, output_path):
    """
    Load the grid GeoJSON and generate static urban morphology data for each grid cell.
    """
    if not os.path.exists(grid_path):
        raise FileNotFoundError(f"Grid file not found: {grid_path}")
        
    gdf = gpd.read_file(grid_path)
    print(f"Loaded {len(gdf)} grid cells.")
    
    # Generate static features
    np.random.seed(42)
    n = len(gdf)
    
    # Satellite / Urban Morphology
    # NDVI (Normalized Difference Vegetation Index): -0.1 to 0.8
    gdf["ndvi"] = np.random.uniform(-0.1, 0.8, n)
    # NDBI (Normalized Difference Built-up Index): -0.2 to 0.7
    gdf["ndbi"] = np.random.uniform(-0.2, 0.7, n)
    # Albedo: 0.1 to 0.4
    gdf["albedo"] = np.random.uniform(0.1, 0.4, n)
    # Vulnerability Index (Demographics)
    gdf["vulnerability_index"] = np.random.uniform(10, 100, n)
    
    try:
        # Save as static features GeoJSON
        gdf.to_file(output_path, driver="GeoJSON")
        print(f"Saved static features data to {output_path}")
    except Exception as e:
        print(f"Error saving data: {e}")

if __name__ == "__main__":
    base_dir = os.path.dirname(__file__)
    grid_file = os.path.join(base_dir, "..", "data", "chennai_grid.geojson")
    output_file = os.path.join(base_dir, "..", "data", "static_features.geojson")
    
    generate_static_features(grid_file, output_file)
