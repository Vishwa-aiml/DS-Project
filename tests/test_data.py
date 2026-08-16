import pytest
import geopandas as gpd
from src.grid import create_grid

def test_create_grid():
    grid = create_grid()
    
    assert isinstance(grid, gpd.GeoDataFrame)
    assert not grid.empty
    assert "grid_id" in grid.columns
    assert "geometry" in grid.columns
    assert len(grid) > 0

    # Ensure coordinates are around Chennai
    bounds = grid.total_bounds # [minx, miny, maxx, maxy]
    assert bounds[0] >= 79.8  # Longitude
    assert bounds[2] <= 80.5
    assert bounds[1] >= 12.7  # Latitude
    assert bounds[3] <= 13.4
