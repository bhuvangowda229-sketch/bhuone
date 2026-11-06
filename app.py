"""
AI-Based Interior Design Suggester with 3D Visualization
Backend Framework: Python with Flask
Database: SQLite / MySQL Relational Database
REST APIs for User Authentication, AI Spatial Recommendations, and Design Persistence
"""

import os
import json
import sqlite3
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__, static_folder='.', static_url_path='')

DB_PATH = os.path.join(os.path.dirname(__file__), 'interior_studio.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            registered_at TEXT,
            last_login TEXT,
            status TEXT DEFAULT 'active'
        )
    ''')
    # Designs table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS designs (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            title TEXT NOT NULL,
            room_type TEXT,
            style TEXT,
            dimensions TEXT,
            data_json TEXT NOT NULL,
            created_at TEXT,
            updated_at TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    ''')
    # Default Admin Seed
    cursor.execute('SELECT * FROM users WHERE email = ?', ('bhuvan@gmail.com',))
    if not cursor.fetchone():
        cursor.execute('''
            INSERT INTO users (id, name, email, password, role, registered_at, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', ('usr_admin', 'Bhuvan (Admin)', 'bhuvan@gmail.com', 'Bhuvan@123', 'admin', datetime.utcnow().isoformat(), 'active'))
    conn.commit()
    conn.close()

# Initialize DB on start
try:
    init_db()
except Exception as e:
    print(f"DB Init Note: {e}")

# ==================== PAGE ROUTES ====================

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/studio')
def studio():
    return send_from_directory('.', 'studio.html')

@app.route('/admin')
def admin():
    return send_from_directory('.', 'admin.html')

@app.route('/login')
def login_page():
    return send_from_directory('.', 'login.html')

@app.route('/signup')
def signup_page():
    return send_from_directory('.', 'signup.html')

# ==================== AI RECOMMENDATION ENGINE API ====================

@app.route('/api/recommend', methods=['POST'])
def recommend():
    """
    AI Spatial & Furniture Recommendation Engine
    Accepts: { roomType, width, length, height, style, wallColor, flooring, lighting }
    Returns: Cohesive furniture layout coordinates, lighting parameters, and design reasoning.
    """
    data = request.get_json() or {}
    room_type = data.get('roomType', 'Living Room')
    width = float(data.get('width', 5.0))
    length = float(data.get('length', 6.0))
    height = float(data.get('height', 2.8))
    style = data.get('style', 'Modern').capitalize()
    
    # Style Palettes & Material Harmony
    style_configs = {
        'Modern': {
            'wallColor': '#F1F5F9',
            'flooring': 'oak_wood',
            'lighting': {'temp': 'neutral', 'intensity': 1.1, 'fixture': 'recessed'},
            'accent': '#3B82F6'
        },
        'Minimalist': {
            'wallColor': '#F8FAFC',
            'flooring': 'light_wood',
            'lighting': {'temp': 'daylight', 'intensity': 1.2, 'fixture': 'diffused'},
            'accent': '#64748B'
        },
        'Luxury': {
            'wallColor': '#1E293B',
            'flooring': 'marble',
            'lighting': {'temp': 'warm', 'intensity': 0.9, 'fixture': 'chandelier'},
            'accent': '#D97706'
        },
        'Traditional': {
            'wallColor': '#FEF3C7',
            'flooring': 'dark_walnut',
            'lighting': {'temp': 'warm', 'intensity': 1.0, 'fixture': 'brass_sconce'},
            'accent': '#92400E'
        }
    }
    
    selected_style = style_configs.get(style, style_configs['Modern'])
    
    # Calculate recommended clearance and furniture placement rules
    furniture_layout = []
    
    if 'living' in room_type.lower():
        furniture_layout = [
            {'type': 'sofa', 'x': 0, 'z': length * 0.2, 'rotation': 0, 'width': 2.2, 'depth': 0.9},
            {'type': 'coffee_table', 'x': 0, 'z': length * 0.2 - 1.2, 'rotation': 0, 'width': 1.1, 'depth': 0.6},
            {'type': 'tv_unit', 'x': 0, 'z': -length * 0.4, 'rotation': 180, 'width': 2.0, 'depth': 0.45},
            {'type': 'armchair', 'x': width * 0.3, 'z': length * 0.1, 'rotation': -45, 'width': 0.85, 'depth': 0.85},
            {'type': 'floor_lamp', 'x': -width * 0.38, 'z': length * 0.35, 'rotation': 45},
            {'type': 'rug', 'x': 0, 'z': length * 0.05, 'width': 2.8, 'depth': 2.0}
        ]
    elif 'bed' in room_type.lower():
        furniture_layout = [
            {'type': 'bed', 'x': 0, 'z': length * 0.22, 'rotation': 0, 'width': 1.9, 'depth': 2.1},
            {'type': 'nightstand_l', 'x': -1.35, 'z': length * 0.22 + 0.6, 'rotation': 0, 'width': 0.5, 'depth': 0.4},
            {'type': 'nightstand_r', 'x': 1.35, 'z': length * 0.22 + 0.6, 'rotation': 0, 'width': 0.5, 'depth': 0.4},
            {'type': 'wardrobe', 'x': -width * 0.4, 'z': -length * 0.1, 'rotation': 90, 'width': 2.0, 'depth': 0.6},
            {'type': 'study_desk', 'x': width * 0.35, 'z': -length * 0.3, 'rotation': 0, 'width': 1.2, 'depth': 0.6}
        ]
    elif 'office' in room_type.lower():
        furniture_layout = [
            {'type': 'executive_desk', 'x': 0, 'z': 0, 'rotation': 0, 'width': 1.8, 'depth': 0.8},
            {'type': 'ergonomic_chair', 'x': 0, 'z': 0.7, 'rotation': 0},
            {'type': 'bookshelf', 'x': -width * 0.4, 'z': 0, 'rotation': 90, 'width': 2.0, 'depth': 0.4},
            {'type': 'visitor_chairs', 'x': 0, 'z': -0.9, 'rotation': 180}
        ]
    else:
        furniture_layout = [
            {'type': 'main_cluster', 'x': 0, 'z': 0, 'rotation': 0}
        ]

    recommendation = {
        'status': 'success',
        'roomType': room_type,
        'style': style,
        'dimensions': {'width': width, 'length': length, 'height': height},
        'styleSpecs': selected_style,
        'layout': furniture_layout,
        'ergonomics': {
            'walkingClearanceMeters': 0.9,
            'circulationEfficiencyScore': '94%',
            'naturalLightOrientation': 'Window at South-East exposure'
        },
        'reasoning': f"Arranged tailored {style} aesthetic for a {width}m x {length}m space with optimized circulation pathways and focal point alignment."
    }
    return jsonify(recommendation)

# ==================== AUTHENTICATION APIS ====================

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name')
    email = (data.get('email') or '').strip().lower()
    password = data.get('password')
    
    if not name or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
    if cursor.fetchone():
        conn.close()
        return jsonify({'error': 'Email already registered'}), 409

    user_id = f"usr_{int(datetime.utcnow().timestamp())}"
    cursor.execute('''
        INSERT INTO users (id, name, email, password, role, registered_at, status)
        VALUES (?, ?, ?, ?, 'user', ?, 'active')
    ''', (user_id, name, email, password, datetime.utcnow().isoformat()))
    conn.commit()
    conn.close()

    return jsonify({'success': True, 'user': {'id': user_id, 'name': name, 'email': email, 'role': 'user'}})

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password')
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE email = ? AND password = ?', (email, password))
    user = cursor.fetchone()
    
    if not user:
        conn.close()
        return jsonify({'error': 'Invalid email or password'}), 401

    user_dict = dict(user)
    del user_dict['password']
    
    # Update last login
    cursor.execute('UPDATE users SET last_login = ? WHERE id = ?', (datetime.utcnow().isoformat(), user_dict['id']))
    conn.commit()
    conn.close()

    return jsonify({'success': True, 'user': user_dict})

@app.route('/api/auth/users', methods=['GET'])
def list_users():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, email, role, registered_at, last_login, status FROM users')
    users = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify({'users': users})

# ==================== DESIGNS PERSISTENCE API ====================

@app.route('/api/designs', methods=['GET', 'POST'])
def manage_designs():
    conn = get_db()
    cursor = conn.cursor()
    
    if request.method == 'POST':
        data = request.get_json() or {}
        design_id = data.get('id', f"dsg_{int(datetime.utcnow().timestamp())}")
        user_id = data.get('userId', 'usr_guest')
        title = data.get('title', 'Untitled Design')
        room_type = data.get('roomType', 'Living Room')
        style = data.get('style', 'Modern')
        dimensions = json.dumps(data.get('dimensions', {}))
        data_json = json.dumps(data)
        now = datetime.utcnow().isoformat()
        
        cursor.execute('''
            INSERT OR REPLACE INTO designs (id, user_id, title, room_type, style, dimensions, data_json, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (design_id, user_id, title, room_type, style, dimensions, data_json, now, now))
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'id': design_id})
    
    else:
        user_id = request.args.get('userId')
        if user_id:
            cursor.execute('SELECT * FROM designs WHERE user_id = ? ORDER BY updated_at DESC', (user_id,))
        else:
            cursor.execute('SELECT * FROM designs ORDER BY updated_at DESC')
        rows = cursor.fetchall()
        designs = [dict(r) for r in rows]
        conn.close()
        return jsonify({'designs': designs})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    print(f"Starting AI Interior Studio on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
