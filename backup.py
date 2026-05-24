import firebase_admin
from firebase_admin import credentials, firestore
import json

# 1. Initialize Firestore
cred = credentials.Certificate("C:\\Users\\ACER\\Downloads\\config.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# 2. JSON helper for Timestamps
def json_serial(obj):
    if hasattr(obj, 'isoformat'):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

# 3. Recursive function to fetch data AND subcollections
def get_doc_data_recursive(doc_snapshot):
    # Get the document's own data
    doc_data = doc_snapshot.to_dict() or {}
    
    # Check for subcollections within this document
    subcollections = doc_snapshot.reference.collections()
    for sub_coll in subcollections:
        # Fetch all documents in the subcollection
        sub_docs = sub_coll.stream()
        doc_data[sub_coll.id] = {s.id: get_doc_data_recursive(s) for s in sub_docs}
        
    return doc_data

# 4. Run for your main collection
# Replace "your_main_collection" with your top-level collection name
main_docs = db.collection("interviews").stream()
final_export = {doc.id: get_doc_data_recursive(doc) for doc in main_docs}

# 5. Save to file
with open("full_database_export.json", "w") as f:
    json.dump(final_export, f, indent=4, default=json_serial)

print(f"Export complete. Check full_database_export.json")
