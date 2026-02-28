"""Quick comparison of our market grades vs Cook Political Report ratings."""
import json
from pathlib import Path

# Our ratings from latest.json
_script_dir = Path(__file__).resolve().parent
with open(_script_dir.parent / "src" / "data" / "grades" / "latest.json") as f:
    data = json.load(f)

our_ratings = {}
for r in data["races"]:
    if r["chamber"] == "House":
        our_ratings[r["label"]] = {"rating": r["rating"], "grade": r["grade"], "margin": r["margin"]}

# Cook Political Report ratings (from user paste)
cook = {}
def add_cook(rating, races):
    for r in races:
        cook[r] = rating

add_cook("Solid D", [
    "AL-02","AL-07","AZ-03","AZ-04","AZ-07","CA-01","CA-02","CA-03","CA-04",
    "CA-06","CA-07","CA-08","CA-09","CA-10","CA-11","CA-12","CA-14","CA-15",
    "CA-16","CA-17","CA-18","CA-19","CA-24","CA-25","CA-26","CA-27","CA-28",
    "CA-29","CA-30","CA-31","CA-32","CA-33","CA-34","CA-35","CA-36","CA-37",
    "CA-38","CA-39","CA-41","CA-42","CA-43","CA-44","CA-46","CA-47","CA-49",
    "CA-50","CA-51","CA-52","CO-01","CO-02","CO-06","CO-07","CT-01","CT-02",
    "CT-03","CT-04","CT-05","DE-AL","FL-09","FL-10","FL-14","FL-20","FL-22",
    "FL-24","FL-25","GA-02","GA-04","GA-05","GA-06","GA-13","HI-01","HI-02",
    "IL-01","IL-02","IL-03","IL-04","IL-05","IL-06","IL-07","IL-08","IL-09",
    "IL-10","IL-11","IL-13","IL-14","IL-17","IN-07","KS-03","KY-03","LA-02",
    "LA-06","MA-01","MA-02","MA-03","MA-04","MA-05","MA-06","MA-07","MA-08",
    "MA-09","MD-02","MD-03","MD-04","MD-05","MD-06","MD-07","MD-08","ME-01",
    "MI-03","MI-06","MI-11","MI-12","MI-13","MN-03","MN-04","MN-05","MO-01",
    "MO-05","MS-02","NC-02","NC-04","NC-12","NJ-01","NJ-03","NJ-05","NJ-06",
    "NJ-08","NJ-10","NJ-11","NJ-12","NM-01","NM-03","NY-05","NY-06","NY-07",
    "NY-08","NY-09","NY-10","NY-12","NY-13","NY-14","NY-15","NY-16","NY-18",
    "NY-20","NY-22","NY-25","NY-26","OH-03","OH-11","OR-01","OR-03","OR-04",
    "OR-06","PA-02","PA-03","PA-04","PA-05","PA-06","PA-12","PA-17","RI-01",
    "RI-02","SC-06","TN-09","TX-07","TX-16","TX-18","TX-20","TX-29","TX-30",
    "TX-33","TX-37","UT-01","VA-03","VA-04","VA-08","VA-10","VA-11","VT-AL",
    "WA-01","WA-02","WA-06","WA-07","WA-08","WA-09","WA-10","WI-02","WI-04",
])

add_cook("Likely D", [
    "CA-21","IN-01","MN-02","NH-01","NH-02","NV-01","NV-04","OR-05",
])

add_cook("Lean D", [
    "CA-13","CA-45","FL-23","MI-08","NE-02","NJ-09","NM-02","NV-03",
    "NY-03","NY-04","NY-19","OH-13","TX-28","VA-07",
])

add_cook("Toss Up", [
    "AZ-01","AZ-06","CA-22","CA-48","CO-08","IA-01","IA-03","MI-07",
    "NJ-07","NY-17","OH-01","OH-09","PA-07","PA-10","TX-34","VA-02",
    "WA-03","WI-03",
])

add_cook("Lean R", [
    "MI-10","NC-01","PA-08","VA-01",
])

add_cook("Likely R", [
    "AK-AL","AZ-02","CO-03","CO-05","FL-07","FL-13","IA-02","ME-02",
    "MI-04","MT-01","NC-11","PA-01","TN-05","TX-15","TX-35","WI-01",
])

add_cook("Solid R", [
    "AL-01","AL-03","AL-04","AL-05","AL-06","AR-01","AR-02","AR-03","AR-04",
    "AZ-05","AZ-08","AZ-09","CA-05","CA-20","CA-23","CA-40","CO-04","FL-01",
    "FL-02","FL-03","FL-04","FL-05","FL-06","FL-08","FL-11","FL-12","FL-15",
    "FL-16","FL-17","FL-18","FL-19","FL-21","FL-26","FL-27","FL-28","GA-01",
    "GA-03","GA-07","GA-08","GA-09","GA-10","GA-11","GA-12","GA-14","IA-04",
    "ID-01","ID-02","IL-12","IL-15","IL-16","IN-02","IN-03","IN-04","IN-05",
    "IN-06","IN-08","IN-09","KS-01","KS-02","KS-04","KY-01","KY-02","KY-04",
    "KY-05","KY-06","LA-01","LA-03","LA-04","LA-05","MD-01","MI-01","MI-02",
    "MI-05","MI-09","MN-01","MN-06","MN-07","MN-08","MO-02","MO-03","MO-04",
    "MO-06","MO-07","MO-08","MS-01","MS-03","MS-04","MT-02","NC-03","NC-05",
    "NC-06","NC-07","NC-08","NC-09","NC-10","NC-13","NC-14","ND-AL","NE-01",
    "NE-03","NJ-02","NJ-04","NV-02","NY-01","NY-02","NY-11","NY-21","NY-23",
    "NY-24","OH-02","OH-04","OH-05","OH-06","OH-07","OH-08","OH-10","OH-12",
    "OH-14","OH-15","OK-01","OK-02","OK-03","OK-04","OK-05","OR-02","PA-09",
    "PA-11","PA-13","PA-14","PA-15","PA-16","SC-01","SC-02","SC-03","SC-04",
    "SC-05","SC-07","SD-AL","TN-01","TN-02","TN-03","TN-04","TN-06","TN-07",
    "TN-08","TX-01","TX-02","TX-03","TX-04","TX-05","TX-06","TX-08","TX-09",
    "TX-10","TX-11","TX-12","TX-13","TX-14","TX-17","TX-19","TX-21","TX-22",
    "TX-23","TX-24","TX-25","TX-26","TX-27","TX-31","TX-32","TX-36","TX-38",
    "UT-02","UT-03","UT-04","VA-05","VA-06","VA-09","WA-04","WA-05","WI-05",
    "WI-06","WI-07","WI-08","WV-01","WV-02","WY-AL",
])

# Rating scale for comparison
SCALE = {"Solid D": -3, "Likely D": -2, "Lean D": -1, "Tossup": 0, "Toss Up": 0,
         "Lean R": 1, "Likely R": 2, "Solid R": 3}

# Compare
deviations = []
matches = 0
total = 0

for label in sorted(set(cook.keys()) & set(our_ratings.keys())):
    c = cook[label]
    o = our_ratings[label]
    c_val = SCALE.get(c, 0)
    o_val = SCALE.get(o["rating"], 0) if o["rating"] else 0
    diff = abs(c_val - o_val)
    total += 1
    if diff == 0:
        matches += 1
    else:
        deviations.append({
            "race": label,
            "cook": c,
            "ours": o["rating"],
            "grade": o["grade"],
            "margin": o["margin"],
            "diff": diff,
        })

deviations.sort(key=lambda x: -x["diff"])

print(f"=== COOK vs MARKET GRADES (House only) ===\n")
print(f"Total compared: {total}")
print(f"Exact match:    {matches} ({100*matches/total:.1f}%)")
print(f"Deviations:     {len(deviations)}")

print(f"\n--- BIG DEVIATIONS (2+ categories off) ---")
big = [d for d in deviations if d["diff"] >= 2]
for d in big:
    direction = "more R" if SCALE.get(d["ours"], 0) > SCALE.get(d["cook"], 0) else "more D"
    m = d['margin'] if d['margin'] is not None else 0
    r = d['ours'] or 'N/A'
    print(f"  {d['race']:8s}  Cook: {d['cook']:10s}  Ours: {r:10s}  (grade {d['grade']}, margin {m:+d})  [{direction}]")

print(f"\n--- SMALL DEVIATIONS (1 category off) ---")
small = [d for d in deviations if d["diff"] == 1]
for d in small:
    direction = "more R" if SCALE.get(d["ours"], 0) > SCALE.get(d["cook"], 0) else "more D"
    m = d['margin'] if d['margin'] is not None else 0
    r = d['ours'] or 'N/A'
    print(f"  {d['race']:8s}  Cook: {d['cook']:10s}  Ours: {r:10s}  (grade {d['grade']}, margin {m:+d})  [{direction}]")

# Distribution summary
print(f"\n--- OUR RATING DISTRIBUTION (House) ---")
from collections import Counter
dist = Counter(r["rating"] for r in our_ratings.values() if r["rating"])
for rating in ["Solid D","Likely D","Lean D","Tossup","Lean R","Likely R","Solid R"]:
    print(f"  {rating:10s}: {dist.get(rating, 0)}")
