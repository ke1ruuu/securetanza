"""
Database utility functions for fetching crime data from Supabase
"""
import os
import psycopg2
import pandas as pd
from datetime import datetime
from typing import Optional, Dict, List
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from root .env.local
root_dir = Path(__file__).parent.parent.parent
env_path = root_dir / '.env.local'
load_dotenv(env_path)

class DatabaseConnection:
    """Handle Supabase database connections and queries"""
    
    def __init__(self):
        # Use DIRECT_URL for better compatibility with psycopg2
        self.database_url = os.getenv('DIRECT_URL') or os.getenv('DATABASE_URL')
        if not self.database_url:
            raise ValueError("DATABASE_URL or DIRECT_URL not found in .env.local")
        
        print(f"📡 Connecting to Supabase database...")
    
    def get_connection(self):
        """Create and return a database connection"""
        return psycopg2.connect(self.database_url)
    
    def fetch_crime_data(
        self, 
        year: Optional[int] = None,
        barangay: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> pd.DataFrame:
        """
        Fetch crime data from Supabase with optional filters
        
        Args:
            year: Filter by specific year
            barangay: Filter by specific barangay
            start_date: Filter by start date
            end_date: Filter by end date
            
        Returns:
            DataFrame with crime data
        """
        query = """
            SELECT 
                id,
                date_committed,
                time_committed,
                incident_type,
                barangay,
                type_of_place,
                modus,
                case_status,
                suspect_arrested,
                created_at
            FROM crime_incidents
            WHERE 1=1
        """
        
        params = []
        
        if year:
            query += " AND EXTRACT(YEAR FROM date_committed) = %s"
            params.append(year)
        
        if barangay:
            query += " AND barangay = %s"
            params.append(barangay)
        
        if start_date:
            query += " AND date_committed >= %s"
            params.append(start_date)
        
        if end_date:
            query += " AND date_committed <= %s"
            params.append(end_date)
        
        query += " ORDER BY date_committed, time_committed"
        
        conn = self.get_connection()
        try:
            df = pd.read_sql_query(query, conn, params=params)
            return df
        finally:
            conn.close()
    
    def get_monthly_crime_counts(
        self,
        year: Optional[int] = None,
        barangay: Optional[str] = None
    ) -> pd.DataFrame:
        """
        Get monthly aggregated crime counts from Supabase
        
        Args:
            year: Filter by specific year
            barangay: Filter by specific barangay
            
        Returns:
            DataFrame with monthly crime counts
        """
        query = """
            SELECT 
                DATE_TRUNC('month', date_committed) as month,
                COUNT(*) as crime_count,
                COUNT(DISTINCT barangay) as barangays_affected
            FROM crime_incidents
            WHERE 1=1
        """
        
        params = []
        
        if year:
            query += " AND EXTRACT(YEAR FROM date_committed) = %s"
            params.append(year)
        
        if barangay:
            query += " AND barangay = %s"
            params.append(barangay)
        
        query += """
            GROUP BY DATE_TRUNC('month', date_committed)
            ORDER BY month
        """
        
        conn = self.get_connection()
        try:
            df = pd.read_sql_query(query, conn, params=params)
            df['month'] = pd.to_datetime(df['month'])
            return df
        finally:
            conn.close()
    
    def get_crime_by_type(
        self,
        year: Optional[int] = None,
        barangay: Optional[str] = None
    ) -> pd.DataFrame:
        """
        Get crime counts by incident type from Supabase
        
        Args:
            year: Filter by specific year
            barangay: Filter by specific barangay
            
        Returns:
            DataFrame with crime counts by type
        """
        query = """
            SELECT 
                incident_type,
                COUNT(*) as count
            FROM crime_incidents
            WHERE 1=1
        """
        
        params = []
        
        if year:
            query += " AND EXTRACT(YEAR FROM date_committed) = %s"
            params.append(year)
        
        if barangay:
            query += " AND barangay = %s"
            params.append(barangay)
        
        query += """
            GROUP BY incident_type
            ORDER BY count DESC
        """
        
        conn = self.get_connection()
        try:
            df = pd.read_sql_query(query, conn, params=params)
            return df
        finally:
            conn.close()
    
    def test_connection(self) -> bool:
        """
        Test the database connection
        
        Returns:
            True if connection successful, False otherwise
        """
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            cursor.close()
            conn.close()
            return result[0] == 1
        except Exception as e:
            print(f"❌ Connection failed: {str(e)}")
            return False
