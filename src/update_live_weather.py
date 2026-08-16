import os
import httpx
import geopandas as gpd

# Open-Meteo API endpoint for Chennai
WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast?latitude=13.0827&longitude=80.2707&current=temperature_2m,relative_humidity_2m,wind_speed_10m"

def fetch_live_weather():
    """Fetches real-time weather data from Open-Meteo."""
    print("Fetching live weather data from Open-Meteo for Chennai...")
    response = httpx.get(WEATHER_API_URL)
    response.raise_for_status()
    data = response.json()
    
    current = data.get("current", {})
    return {
        "temperature_c": current.get("temperature_2m", 35.0),
        "humidity_pct": current.get("relative_humidity_2m", 60.0),
        "wind_speed_ms": current.get("wind_speed_10m", 5.0)
    }

def update_grid_weather(static_features_path, output_path, live_weather):
    """
    Loads static grid features, applies live weather with Urban Heat Island adjustments,
    and saves the dynamic GeoJSON.
    """
    print(f"Loading static features from {static_features_path}...")
    gdf = gpd.read_file(static_features_path)
    
    base_temp = live_weather["temperature_c"]
    base_hum = live_weather["humidity_pct"]
    base_wind = live_weather["wind_speed_ms"]
    
    print(f"Base Live Weather - Temp: {base_temp}°C, Humidity: {base_hum}%, Wind: {base_wind}m/s")
    
    # Apply Urban Micro-Climate Model (UHI)
    # Concrete (NDBI) increases heat/lowers humidity. Parks (NDVI) lower heat/increase humidity.
    gdf["temperature_c"] = base_temp + (gdf["ndbi"] * 3.0) - (gdf["ndvi"] * 2.0)
    gdf["humidity_pct"] = base_hum + (gdf["ndvi"] * 10.0) - (gdf["ndbi"] * 5.0)
    gdf["humidity_pct"] = gdf["humidity_pct"].clip(0, 100) # Ensure humidity is within 0-100%
    gdf["wind_speed_ms"] = base_wind
    
    # Calculate live Land Surface Temperature (LST) based on air temp + morphology
    gdf["lst_c"] = gdf["temperature_c"] + 4.0 - (gdf["ndvi"] * 5.0) + (gdf["ndbi"] * 5.0)
    
    try:
        print(f"Saving dynamic geojson to {output_path}...")
        gdf.to_file(output_path, driver="GeoJSON")
        print("Successfully updated the live weather grid!")
    except Exception as e:
        print(f"Error saving data: {e}")

if __name__ == "__main__":
    base_dir = os.path.dirname(__file__)
    static_file = os.path.join(base_dir, "..", "data", "static_features.geojson")
    output_file = os.path.join(base_dir, "..", "data", "synthetic_features.geojson")
    
    if not os.path.exists(static_file):
        print(f"Error: {static_file} not found. Please run generate_static_features.py first.")
    else:
        live_weather = fetch_live_weather()
        update_grid_weather(static_file, output_file, live_weather)
