import pandas as pd
import requests
import io
import re

# Census Gazetteer Places (most recent)
url = "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2023_Gaz_place_national.zip"

df = pd.read_csv(url, compression="zip", sep="\t")

def slugify(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")

output = pd.DataFrame({
    "country_code": "us",
    "state_slug": df["USPS"].str.lower().map({
        'AL':'alabama','AK':'alaska','AZ':'arizona','AR':'arkansas','CA':'california',
        'CO':'colorado','CT':'connecticut','DE':'delaware','FL':'florida','GA':'georgia',
        'HI':'hawaii','ID':'idaho','IL':'illinois','IN':'indiana','IA':'iowa','KS':'kansas',
        'KY':'kentucky','LA':'louisiana','ME':'maine','MD':'maryland','MA':'massachusetts',
        'MI':'michigan','MN':'minnesota','MS':'mississippi','MO':'missouri','MT':'montana',
        'NE':'nebraska','NV':'nevada','NH':'new-hampshire','NJ':'new-jersey',
        'NM':'new-mexico','NY':'new-york','NC':'north-carolina','ND':'north-dakota',
        'OH':'ohio','OK':'oklahoma','OR':'oregon','PA':'pennsylvania','RI':'rhode-island',
        'SC':'south-carolina','SD':'south-dakota','TN':'tennessee','TX':'texas',
        'UT':'utah','VT':'vermont','VA':'virginia','WA':'washington',
        'WV':'west-virginia','WI':'wisconsin','WY':'wyoming','DC':'district-of-columbia'
    }),
    "name": df["NAME"],
    "slug": df["NAME"].apply(slugify),
    "population": df["POP2020"]
})

output.to_csv("us_all_census_places.csv", index=False)
print(f"Generated {len(output)} rows")
