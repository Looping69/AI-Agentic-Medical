-- Seed AI agents
INSERT INTO ai_agents (id, name, description, icon, is_premium, specialties, capabilities)
VALUES
  ('general-medicine', 'General Medicine', 'Comprehensive medical knowledge covering common conditions, symptoms, and treatments.', 'Brain', false, ARRAY['Symptom Analysis', 'Treatment Suggestions', 'Patient Education'], ARRAY['Analyze patient symptoms and medical history', 'Provide evidence-based recommendations', 'Generate detailed medical reports']),
  
  ('medical-records', 'Medical Records', 'Intelligent EHR assistant that helps organize and analyze patient records efficiently.', 'FileText', false, ARRAY['FHIR Integration', 'Patient History', 'Trend Analysis'], ARRAY['Organize and analyze patient records', 'Track medical history and trends', 'Generate comprehensive reports']),
  
  ('vitals-monitor', 'Vitals Monitor', 'Tracks and analyzes patient vital signs, alerting to concerning patterns.', 'Activity', false, ARRAY['BP Monitoring', 'Heart Rate', 'Respiratory Rate'], ARRAY['Monitor vital signs in real-time', 'Detect concerning patterns', 'Provide alerts for abnormal readings']),
  
  ('cardiology', 'Cardiology', 'Specialized in cardiovascular conditions, heart health, and related treatments.', 'Heart', true, ARRAY['Heart Disease', 'Arrhythmias', 'Preventive Cardiology'], ARRAY['Analyze ECG readings', 'Assess cardiovascular risk factors', 'Recommend specialized treatments']),
  
  ('pathology', 'Pathology', 'Expert in analyzing lab results, tissue samples, and disease markers.', 'Microscope', true, ARRAY['Lab Result Analysis', 'Histopathology', 'Disease Markers'], ARRAY['Interpret laboratory test results', 'Analyze tissue samples', 'Identify disease markers']),
  
  ('radiology', 'Radiology', 'Specialized in analyzing and interpreting medical imaging studies.', 'FileText', true, ARRAY['X-Ray', 'CT Scan', 'MRI', 'Ultrasound'], ARRAY['Analyze medical images', 'Detect abnormalities', 'Provide detailed reports']),
  
  ('neurology', 'Neurology', 'Focused on disorders of the nervous system, including the brain and spinal cord.', 'Brain', true, ARRAY['Neurological Disorders', 'Cognitive Assessment', 'Movement Disorders'], ARRAY['Analyze neurological symptoms', 'Assess cognitive function', 'Recommend specialized treatments']),
  
  ('pediatrics', 'Pediatrics', 'Specialized in the health and medical care of infants, children, and adolescents.', 'Baby', true, ARRAY['Child Development', 'Pediatric Conditions', 'Immunizations'], ARRAY['Assess child development', 'Diagnose pediatric conditions', 'Provide age-appropriate recommendations']);

-- Seed sample patients (only if the patients table is empty)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM patients LIMIT 1) THEN
    INSERT INTO patients (first_name, last_name, date_of_birth, gender, email, phone, conditions, medications, allergies, last_visit)
    VALUES
      ('John', 'Doe', '1978-05-12', 'Male', 'john.doe@example.com', '555-123-4567', ARRAY['Hypertension', 'Type 2 Diabetes'], ARRAY['Lisinopril 10mg', 'Metformin 500mg'], ARRAY['Penicillin'], '2023-11-15'),
      
      ('Jane', 'Smith', '1985-09-23', 'Female', 'jane.smith@example.com', '555-987-6543', ARRAY['Asthma', 'Seasonal Allergies'], ARRAY['Albuterol inhaler', 'Cetirizine 10mg'], ARRAY['Sulfa drugs', 'Latex'], '2023-12-03'),
      
      ('Robert', 'Johnson', '1965-03-18', 'Male', 'robert.johnson@example.com', '555-456-7890', ARRAY['Coronary Artery Disease', 'Hyperlipidemia'], ARRAY['Atorvastatin 20mg', 'Aspirin 81mg', 'Metoprolol 25mg'], ARRAY['Codeine'], '2023-10-28'),
      
      ('Emily', 'Davis', '1992-11-30', 'Female', 'emily.davis@example.com', '555-789-0123', ARRAY['Migraine', 'Anxiety'], ARRAY['Sumatriptan 50mg', 'Sertraline 50mg'], ARRAY['NSAIDs'], '2023-11-20'),
      
      ('Michael', 'Wilson', '1972-07-08', 'Male', 'michael.wilson@example.com', '555-234-5678', ARRAY['GERD', 'Insomnia'], ARRAY['Omeprazole 20mg', 'Melatonin 5mg'], ARRAY['None'], '2023-12-10'),
      
      ('Sarah', 'Brown', '1988-02-14', 'Female', 'sarah.brown@example.com', '555-876-5432', ARRAY['Hypothyroidism'], ARRAY['Levothyroxine 75mcg'], ARRAY['Iodine contrast'], '2023-11-05'),
      
      ('David', 'Miller', '1955-12-25', 'Male', 'david.miller@example.com', '555-345-6789', ARRAY['Osteoarthritis', 'Benign Prostatic Hyperplasia'], ARRAY['Acetaminophen 500mg', 'Tamsulosin 0.4mg'], ARRAY['Shellfish'], '2023-10-15'),
      
      ('Jennifer', 'Taylor', '1980-06-19', 'Female', 'jennifer.taylor@example.com', '555-654-3210', ARRAY['Depression', 'IBS'], ARRAY['Fluoxetine 20mg', 'Dicyclomine 10mg'], ARRAY['None'], '2023-12-08');
  END IF;
END
$$;
