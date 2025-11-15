import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { Product, Bill, Settings } from '../types';

interface DataContextType {
  products: Product[];
  bills: Bill[];
  settings: Settings;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  addBill: (bill: Omit<Bill, 'id' | 'date'>) => Bill;
  getBillById: (id: string) => Bill | undefined;
  updateSettings: (settings: Settings) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialProducts: Product[] = [
    // 1) Skull & Brain X-Ray
    { id: 'XSK01', name: 'X-Ray Skull AP', price: 400, stock: 0, isService: true },
    { id: 'XSK02', name: 'X-Ray Skull LAT', price: 400, stock: 0, isService: true },
    { id: 'XSK03', name: 'X-Ray Skull PA', price: 400, stock: 0, isService: true },
    { id: 'XSK04', name: 'X-Ray Skull both oblique', price: 800, stock: 0, isService: true },
    { id: 'XSK05', name: 'X-Ray Skull base view', price: 400, stock: 0, isService: true },
    { id: 'XSK06', name: 'X-Ray Sella Turcica', price: 400, stock: 0, isService: true },
    { id: 'XSK07', name: 'X-Ray Orbit AP', price: 400, stock: 0, isService: true },
    { id: 'XSK08', name: 'X-Ray Orbit LAT', price: 400, stock: 0, isService: true },
    { id: 'XSK09', name: 'X-Ray PNS (Paranasal Sinus)', price: 400, stock: 0, isService: true },
    { id: 'XSK10', name: 'X-Ray PNS Waters view', price: 400, stock: 0, isService: true },
    { id: 'XSK11', name: 'X-Ray TM Joint AP', price: 400, stock: 0, isService: true },
    { id: 'XSK12', name: 'X-Ray TM Joint LAT', price: 400, stock: 0, isService: true },
    { id: 'XSK13', name: 'X-Ray Mastoid AP', price: 400, stock: 0, isService: true },
    { id: 'XSK14', name: 'X-Ray Mastoid LAT', price: 400, stock: 0, isService: true },
    { id: 'XSK15', name: 'X-Ray Zygomatic arch', price: 400, stock: 0, isService: true },
    { id: 'XSK16', name: 'X-Ray Nasal bone LAT', price: 400, stock: 0, isService: true },
    { id: 'XSK17', name: 'X-Ray Nasal bone both LAT', price: 800, stock: 0, isService: true },
    { id: 'XSK18', name: 'X-Ray Occipital bone view', price: 400, stock: 0, isService: true },
    // 2) Cervical Spine X-Ray
    { id: 'XCS01', name: 'X-Ray C-Spine AP', price: 400, stock: 0, isService: true },
    { id: 'XCS02', name: 'X-Ray C-Spine LAT', price: 400, stock: 0, isService: true },
    { id: 'XCS03', name: 'X-Ray C-Spine Oblique (both sides)', price: 800, stock: 0, isService: true },
    { id: 'XCS04', name: 'X-Ray C-Spine Flexion', price: 400, stock: 0, isService: true },
    { id: 'XCS05', name: 'X-Ray C-Spine Extension', price: 400, stock: 0, isService: true },
    { id: 'XCS06', name: 'X-Ray Odontoid peg view (C1-C2)', price: 400, stock: 0, isService: true },
    { id: 'XCS07', name: 'X-Ray Atlanto-axial joint view', price: 400, stock: 0, isService: true },
    // 3) Thoracic Spine X-Ray
    { id: 'XTS01', name: 'X-Ray Dorsal/Thoracic Spine AP', price: 400, stock: 0, isService: true },
    { id: 'XTS02', name: 'X-Ray Dorsal/Thoracic Spine LAT', price: 400, stock: 0, isService: true },
    { id: 'XTS03', name: 'X-Ray Thoracic Oblique', price: 400, stock: 0, isService: true },
    // 4) Lumbar Spine X-Ray
    { id: 'XLS01', name: 'X-Ray L-Spine AP', price: 400, stock: 0, isService: true },
    { id: 'XLS02', name: 'X-Ray L-Spine LAT', price: 400, stock: 0, isService: true },
    { id: 'XLS03', name: 'X-Ray L-Spine Oblique (both sides)', price: 800, stock: 0, isService: true },
    { id: 'XLS04', name: 'X-Ray L-Spine Flexion view', price: 400, stock: 0, isService: true },
    { id: 'XLS05', name: 'X-Ray L-Spine Extension view', price: 400, stock: 0, isService: true },
    { id: 'XLS06', name: 'X-Ray Sacro-iliac Joint AP', price: 400, stock: 0, isService: true },
    { id: 'XLS07', name: 'X-Ray Sacro-iliac Joint Oblique', price: 400, stock: 0, isService: true },
    // 5) Pelvis & Hip X-Ray
    { id: 'XPH01', name: 'X-Ray Pelvis AP', price: 400, stock: 0, isService: true },
    { id: 'XPH02', name: 'X-Ray Pelvis LAT', price: 400, stock: 0, isService: true },
    { id: 'XPH03', name: 'X-Ray Hip Joint AP', price: 400, stock: 0, isService: true },
    { id: 'XPH04', name: 'X-Ray Hip Joint LAT', price: 400, stock: 0, isService: true },
    { id: 'XPH05', name: 'X-Ray Both Hip AP', price: 600, stock: 0, isService: true },
    { id: 'XPH06', name: 'X-Ray Both Hip LAT', price: 600, stock: 0, isService: true },
    { id: 'XPH07', name: 'X-Ray Acetabulum view', price: 400, stock: 0, isService: true },
    { id: 'XPH08', name: 'X-Ray Sacrum & Coccyx AP', price: 400, stock: 0, isService: true },
    { id: 'XPH09', name: 'X-Ray Sacrum & Coccyx LAT', price: 400, stock: 0, isService: true },
    // 6) Chest X-Ray
    { id: 'XCH01', name: 'X-Ray Chest PA', price: 400, stock: 0, isService: true },
    { id: 'XCH02', name: 'X-Ray Chest AP', price: 400, stock: 0, isService: true },
    { id: 'XCH03', name: 'X-Ray Chest LAT', price: 400, stock: 0, isService: true },
    { id: 'XCH04', name: 'X-Ray Chest Oblique', price: 400, stock: 0, isService: true },
    { id: 'XCH05', name: 'X-Ray Decubitus view', price: 400, stock: 0, isService: true },
    { id: 'XCH06', name: 'X-Ray Expiratory view', price: 400, stock: 0, isService: true },
    { id: 'XCH07', name: 'X-Ray Rib X-Ray (single/both)', price: 800, stock: 0, isService: true },
    { id: 'XCH08', name: 'X-Ray Clavicle AP', price: 400, stock: 0, isService: true },
    { id: 'XCH09', name: 'X-Ray Clavicle LAT', price: 400, stock: 0, isService: true },
    // 7) Abdomen X-Ray
    { id: 'XAB01', name: 'X-Ray Abdomen AP', price: 400, stock: 0, isService: true },
    { id: 'XAB02', name: 'X-Ray Abdomen erect', price: 400, stock: 0, isService: true },
    { id: 'XAB03', name: 'X-Ray KUB (Kidney-Ureter-Bladder)', price: 400, stock: 0, isService: true },
    { id: 'XAB04', name: 'X-Ray IVP preparation film', price: 400, stock: 0, isService: true },
    { id: 'XAB05', name: 'X-Ray Bowel obstruction views', price: 800, stock: 0, isService: true },
    { id: 'XAB06', name: 'X-Ray Abdomen LAT decubitus', price: 400, stock: 0, isService: true },
    // 8) Upper Limb X-Ray
    { id: 'XUL01', name: 'X-Ray Shoulder AP', price: 400, stock: 0, isService: true },
    { id: 'XUL02', name: 'X-Ray Shoulder LAT (Y-view)', price: 400, stock: 0, isService: true },
    { id: 'XUL03', name: 'X-Ray Shoulder Axial', price: 400, stock: 0, isService: true },
    { id: 'XUL04', name: 'X-Ray Scapula AP', price: 400, stock: 0, isService: true },
    { id: 'XUL05', name: 'X-Ray Scapula LAT', price: 400, stock: 0, isService: true },
    { id: 'XUL06', name: 'X-Ray Humerus AP', price: 400, stock: 0, isService: true },
    { id: 'XUL07', name: 'X-Ray Humerus LAT', price: 400, stock: 0, isService: true },
    { id: 'XUL08', name: 'X-Ray Elbow AP', price: 400, stock: 0, isService: true },
    { id: 'XUL09', name: 'X-Ray Elbow LAT', price: 400, stock: 0, isService: true },
    { id: 'XUL10', name: 'X-Ray Elbow oblique', price: 400, stock: 0, isService: true },
    { id: 'XUL11', name: 'X-Ray Forearm AP', price: 400, stock: 0, isService: true },
    { id: 'XUL12', name: 'X-Ray Forearm LAT', price: 400, stock: 0, isService: true },
    { id: 'XUL13', name: 'X-Ray Wrist AP', price: 400, stock: 0, isService: true },
    { id: 'XUL14', name: 'X-Ray Wrist LAT', price: 400, stock: 0, isService: true },
    { id: 'XUL15', name: 'X-Ray Wrist Oblique', price: 400, stock: 0, isService: true },
    { id: 'XUL16', name: 'X-Ray Hand AP', price: 400, stock: 0, isService: true },
    { id: 'XUL17', name: 'X-Ray Hand LAT', price: 400, stock: 0, isService: true },
    { id: 'XUL18', name: 'X-Ray Hand Oblique', price: 400, stock: 0, isService: true },
    { id: 'XUL19', name: 'X-Ray Fingers AP', price: 400, stock: 0, isService: true },
    { id: 'XUL20', name: 'X-Ray Fingers LAT', price: 400, stock: 0, isService: true },
    { id: 'XUL21', name: 'X-Ray Thumb AP', price: 400, stock: 0, isService: true },
    { id: 'XUL22', name: 'X-Ray Thumb LAT', price: 400, stock: 0, isService: true },
    // 9) Lower Limb X-Ray
    { id: 'XLL01', name: 'X-Ray Femur AP', price: 400, stock: 0, isService: true },
    { id: 'XLL02', name: 'X-Ray Femur LAT', price: 400, stock: 0, isService: true },
    { id: 'XLL03', name: 'X-Ray Knee AP', price: 400, stock: 0, isService: true },
    { id: 'XLL04', name: 'X-Ray Knee LAT', price: 400, stock: 0, isService: true },
    { id: 'XLL05', name: 'X-Ray Knee skyline patella', price: 400, stock: 0, isService: true },
    { id: 'XLL06', name: 'X-Ray Bilateral knee AP/standing', price: 600, stock: 0, isService: true },
    { id: 'XLL07', name: 'X-Ray Knee oblique', price: 400, stock: 0, isService: true },
    { id: 'XLL08', name: 'X-Ray Tibia/Fibula AP', price: 400, stock: 0, isService: true },
    { id: 'XLL09', name: 'X-Ray Tibia/Fibula LAT', price: 400, stock: 0, isService: true },
    { id: 'XLL10', name: 'X-Ray Ankle AP', price: 400, stock: 0, isService: true },
    { id: 'XLL11', name: 'X-Ray Ankle LAT', price: 400, stock: 0, isService: true },
    { id: 'XLL12', name: 'X-Ray Ankle Oblique', price: 400, stock: 0, isService: true },
    { id: 'XLL13', name: 'X-Ray Foot AP', price: 400, stock: 0, isService: true },
    { id: 'XLL14', name: 'X-Ray Foot LAT', price: 400, stock: 0, isService: true },
    { id: 'XLL15', name: 'X-Ray Foot Oblique', price: 400, stock: 0, isService: true },
    { id: 'XLL16', name: 'X-Ray Calcaneum LAT', price: 400, stock: 0, isService: true },
    { id: 'XLL17', name: 'X-Ray Calcaneum axial', price: 400, stock: 0, isService: true },
    // 10) Dental / Maxillofacial X-Ray
    { id: 'XDE01', name: 'X-Ray OPG (Orthopantomogram)', price: 700, stock: 0, isService: true },
    { id: 'XDE02', name: 'X-Ray Cephalogram LAT', price: 700, stock: 0, isService: true },
    { id: 'XDE03', name: 'X-Ray TM Joint (open/close views)', price: 800, stock: 0, isService: true },
    { id: 'XDE04', name: 'X-Ray Mandible AP', price: 400, stock: 0, isService: true },
    { id: 'XDE05', name: 'X-Ray Mandible LAT', price: 400, stock: 0, isService: true },
    { id: 'XDE06', name: 'X-Ray Mandible oblique', price: 400, stock: 0, isService: true },
    { id: 'XDE07', name: 'X-Ray Maxilla view', price: 400, stock: 0, isService: true },
    // 11) Contrast X-Ray
    { id: 'XCO01', name: 'X-Ray Barium swallow', price: 2500, stock: 0, isService: true },
    { id: 'XCO02', name: 'X-Ray Barium meal', price: 3000, stock: 0, isService: true },
    { id: 'XCO03', name: 'X-Ray Barium follow-through', price: 3500, stock: 0, isService: true },
    { id: 'XCO04', name: 'X-Ray Barium enema', price: 4000, stock: 0, isService: true },
    { id: 'XCO05', name: 'X-Ray MCU (Micturating cystourethrogram)', price: 3000, stock: 0, isService: true },
    { id: 'XCO06', name: 'X-Ray RGU (Retrograde urethrogram)', price: 3000, stock: 0, isService: true },
    { id: 'XCO07', name: 'X-Ray IVP series / KUB series', price: 3500, stock: 0, isService: true },
    { id: 'XCO08', name: 'X-Ray HSG (Hysterosalpingography)', price: 4000, stock: 0, isService: true },
    // 12) Special Orthopedic Views
    { id: 'XOR01', name: 'X-Ray Scaphoid view', price: 400, stock: 0, isService: true },
    { id: 'XOR02', name: 'X-Ray Axial patella view', price: 400, stock: 0, isService: true },
    { id: 'XOR03', name: 'X-Ray Stress views', price: 800, stock: 0, isService: true },
    { id: 'XOR04', name: 'X-Ray Weight-bearing ankle', price: 400, stock: 0, isService: true },
    { id: 'XOR05', name: 'X-Ray Weight-bearing knee', price: 400, stock: 0, isService: true },
    { id: 'XOR06', name: 'X-Ray Tunnel view knee', price: 400, stock: 0, isService: true },
    { id: 'XOR07', name: 'X-Ray AP mortise ankle view', price: 400, stock: 0, isService: true },
    // 13) Pediatric X-Ray
    { id: 'XPE01', name: 'X-Ray Bone age', price: 400, stock: 0, isService: true },
    { id: 'XPE02', name: 'X-Ray Babygram', price: 1000, stock: 0, isService: true },
    { id: 'XPE03', name: 'X-Ray Neonatal chest', price: 400, stock: 0, isService: true },
    { id: 'XPE04', name: 'X-Ray Pediatric abdomen', price: 400, stock: 0, isService: true },
    { id: 'XPE05', name: 'X-Ray Long bone X-Ray', price: 400, stock: 0, isService: true },
    { id: 'XPE06', name: 'X-Ray Epiphyseal plate views', price: 400, stock: 0, isService: true },
    // 14) Full-Length Studies
    { id: 'XFL01', name: 'X-Ray Full spine AP', price: 1500, stock: 0, isService: true },
    { id: 'XFL02', name: 'X-Ray Full spine LAT', price: 1500, stock: 0, isService: true },
    { id: 'XFL03', name: 'X-Ray Long leg scanogram', price: 1500, stock: 0, isService: true },
    { id: 'XFL04', name: 'X-Ray Limb length measurement views', price: 1500, stock: 0, isService: true },
    // 15) Emergency & Trauma X-Ray
    { id: 'XTR01', name: 'X-Ray Trauma series', price: 1500, stock: 0, isService: true },
    { id: 'XTR02', name: 'X-Ray Pelvis trauma view', price: 400, stock: 0, isService: true },
    { id: 'XTR03', name: 'X-Ray C-spine trauma (cross-table LAT)', price: 400, stock: 0, isService: true },
    { id: 'XTR04', name: 'X-Ray FAST-XRay series', price: 1000, stock: 0, isService: true },
    { id: 'XTR05', name: 'X-Ray Chest trauma series', price: 800, stock: 0, isService: true },
    // 16) Miscellaneous Views
    { id: 'XMI01', name: 'X-Ray Soft tissue neck', price: 400, stock: 0, isService: true },
    { id: 'XMI02', name: 'X-Ray Thoracic inlet view', price: 400, stock: 0, isService: true },
    { id: 'XMI03', name: 'X-Ray Retro-pharyngeal space view', price: 400, stock: 0, isService: true },
    { id: 'XMI04', name: 'X-Ray Sternum AP', price: 400, stock: 0, isService: true },
    { id: 'XMI05', name: 'X-Ray Sternum LAT', price: 400, stock: 0, isService: true },
    { id: 'XMI06', name: 'X-Ray Ribs unilateral/bilateral', price: 800, stock: 0, isService: true },
    // New Lab Tests
    { id: 'LDBIO0035', name: 'ADENOSINE DEAMINASE (ADA)', price: 750, stock: 0, isService: true },
    { id: 'LDBIO0125', name: 'Alanine Amino-transferase (ALT) SGPT', price: 210, stock: 0, isService: true },
    { id: 'LDBIO0138', name: 'AMYLASE, SERUM', price: 550, stock: 0, isService: true },
    { id: 'LDBIO0147', name: 'ANGIOTENSIN CONVERTING ENZYME (ACE)', price: 600, stock: 0, isService: true },
    { id: 'LDBIO0202', name: 'Aspartate Aminotransferase (AST) SGOT', price: 210, stock: 0, isService: true },
    { id: 'LDBIO0240', name: 'BILIRUBIN TOTAL, DIRECT & INDIRECT', price: 300, stock: 0, isService: true },
    { id: 'LDBIO0253', name: 'Blood Glucose Fasting (FBS)', price: 80, stock: 0, isService: true },
    { id: 'LDBIO0255', name: 'Blood Glucose Post prandial (PPBS)', price: 80, stock: 0, isService: true },
    { id: 'LDBIO0258', name: 'BLOOD UREA NITROGEN (BUN)', price: 230, stock: 0, isService: true },
    { id: 'LDBIO0281', name: 'C3 Complement', price: 700, stock: 0, isService: true },
    { id: 'LDBIO0282', name: 'C4 Complement', price: 650, stock: 0, isService: true },
    { id: 'LDBIO0345', name: 'Ceruloplasmin, Serum', price: 1200, stock: 0, isService: true },
    { id: 'LDBIO0360', name: 'Cholesterol Total', price: 250, stock: 0, isService: true },
    { id: 'LDBIO0402', name: 'C-REACTIVE PROTEIN (CRP), QUANTITATIVE', price: 600, stock: 0, isService: true },
    { id: 'LDBIO0403', name: 'Creatine Phosphokinase (CK/CPK), Serum', price: 500, stock: 0, isService: true },
    { id: 'LDBIO0404', name: 'Creatine Phosphokinase MB (CPK-MB)', price: 470, stock: 0, isService: true },
    { id: 'LDBIO0408', name: 'CREATININE, SERUM', price: 200, stock: 0, isService: true },
    { id: 'LDBIO0497', name: 'Electrolytes, Serum', price: 550, stock: 0, isService: true },
    { id: 'LDBIO0634', name: 'HBA1C (GLYCATED HAEMOGLOBIN)', price: 600, stock: 0, isService: true },
    { id: 'LDBIO0882', name: 'IRON STUDIES, BASIC', price: 600, stock: 0, isService: true },
    { id: 'LDBIO0885', name: 'Iron, Serum', price: 350, stock: 0, isService: true },
    { id: 'LDBIO0904', name: 'KIDNEY/RENAL FUNCTION TESTS GOLD (KFT GOLD /RFT GOLD)', price: 1060, stock: 0, isService: true },
    { id: 'LDBIO0929', name: 'LIPASE', price: 750, stock: 0, isService: true },
    { id: 'LDBIO0936', name: 'Liver Function Test Gold (LFT Gold)', price: 900, stock: 0, isService: true },
    { id: 'LDBIO0937', name: 'LUPUS ANTICOAGULANT (DRVVT)', price: 1700, stock: 0, isService: true },
    { id: 'LDBIO1152', name: 'SERUM PROTEIN ELECTROPHORESIS (SPE)', price: 850, stock: 0, isService: true },
    { id: 'LDBIO1207', name: 'Total Iron Binding Capacity (TIBC)', price: 650, stock: 0, isService: true },
    { id: 'LDBIO1209', name: 'Total Protein , Serum', price: 190, stock: 0, isService: true },
    { id: 'LDBIO1225', name: 'Triglycerides, Serum', price: 340, stock: 0, isService: true },
    { id: 'LDBIO1229', name: 'Troponin - T', price: 1500, stock: 0, isService: true },
    { id: 'LDBIO1247', name: 'URIC ACID, SERUM', price: 200, stock: 0, isService: true },
    { id: 'LDBIO1573', name: 'Kappa Free Light Chain, Serum', price: 2600, stock: 0, isService: true },
    { id: 'LDBIO1796', name: 'LIPID PROFILE', price: 750, stock: 0, isService: true },
    { id: 'LDCOA1107', name: 'Prothombin Time (PT/INR)', price: 400, stock: 0, isService: true },
    { id: 'LDCYT0560', name: 'FLUID EXAMINATION, ROUTINE', price: 700, stock: 0, isService: true },
    { id: 'LDCYT1046', name: 'PAP SMEAR BY LBC / LIQUID BASED CYTOLOGY', price: 1300, stock: 0, isService: true },
    { id: 'LDCYT1047', name: 'PAP SMEAR BY LBC WITH HPV HIGH RISK DETECTION', price: 2350, stock: 0, isService: true },
    { id: 'LDFLO0334', name: 'CD4/CD8, FLOWCYTOMETRY', price: 2000, stock: 0, isService: true },
    { id: 'LDHEM0014', name: 'ABNORMAL HEMOGLOBIN STUDY (HB ELECTROPHORESIS)', price: 1000, stock: 0, isService: true },
    { id: 'LDHEM0257', name: 'Blood Group ABO and Rh Typing', price: 120, stock: 0, isService: true },
    { id: 'LDHEM0378', name: 'COMPLETE BLOOD COUNT (CBC)', price: 350, stock: 0, isService: true },
    { id: 'LDHEM0379', name: 'Complete Urine Examination', price: 120, stock: 0, isService: true },
    { id: 'LDHEM0382', name: 'Coombs Test, Direct', price: 550, stock: 0, isService: true },
    { id: 'LDHEM0383', name: 'COOMBS TEST, INDIRECT', price: 550, stock: 0, isService: true },
    { id: 'LDHEM0504', name: 'Erythrocyte Sedimentation Rate (ESR)', price: 120, stock: 0, isService: true },
    { id: 'LDHEM0603', name: 'Glucose-6 Phosphate Dehydrogenase (G6PD), Quantitative', price: 1050, stock: 0, isService: true },
    { id: 'LDHEM0622', name: 'Hemoglobin (Hb)', price: 110, stock: 0, isService: true },
    { id: 'LDHEM0626', name: 'HEMOGRAM (CBC WITH ESR)', price: 500, stock: 0, isService: true },
    { id: 'LDHEM0948', name: 'Malaria Antigen Test', price: 650, stock: 0, isService: true },
    { id: 'LDHEM1058', name: 'PERIPHERAL BLOOD SMEAR FOR MALARIAL PARASITE (PS FOR MP)', price: 180, stock: 0, isService: true },
    { id: 'LDHEM1566', name: 'Platelet Count', price: 120, stock: 0, isService: true },
    { id: 'LDHIS0680', name: 'HISTOPATHOLOGY- LARGE SPECIMEN', price: 1900, stock: 0, isService: true },
    { id: 'LDHIS0681', name: 'HISTOPATHOLOGY- MEDIUM SPECIMEN', price: 1300, stock: 0, isService: true },
    { id: 'LDHIS0691', name: 'HISTOPATHOLOGY- SMALL SPECIMEN', price: 800, stock: 0, isService: true },
    { id: 'LDIMM0120', name: 'ALPHA FETOPROTEIN (AFP), SERUM', price: 800, stock: 0, isService: true },
    { id: 'LDIMM0152', name: 'ANTI - ds DNA , IFA in Dilutions', price: 3250, stock: 0, isService: true },
    { id: 'LDIMM0169', name: 'ANTI MULLERIAN HORMONE (AMH), SERUM', price: 2200, stock: 0, isService: true },
    { id: 'LDIMM0174', name: 'Anti Phospholipid Antibodies IgG & IgM', price: 1450, stock: 0, isService: true },
    { id: 'LDIMM0231', name: 'BETA HCG, SERUM', price: 800, stock: 0, isService: true },
    { id: 'LDIMM0277', name: 'C -PEPTIDE (FASTING)', price: 1100, stock: 0, isService: true },
    { id: 'LDIMM0285', name: 'CA 19-9', price: 1100, stock: 0, isService: true },
    { id: 'LDIMM0286', name: 'CA 72-4 (Gastric Cancer)', price: 1900, stock: 0, isService: true },
    { id: 'LDIMM0287', name: 'CA 125', price: 1400, stock: 0, isService: true },
    { id: 'LDIMM0288', name: 'CA 15-3', price: 1250, stock: 0, isService: true },
    { id: 'LDIMM0292', name: 'Calcium', price: 210, stock: 0, isService: true },
    { id: 'LDIMM0305', name: 'CARCINO EMBYONIC ANTIGEN (CEA), SERUM', price: 720, stock: 0, isService: true },
    { id: 'LDIMM0390', name: 'CORTISOL (MORNING SAMPLE)', price: 700, stock: 0, isService: true },
    { id: 'LDIMM0481', name: 'DUAL MARKER (DOUBLE MARKER)- FIRST TRIMESTER', price: 2400, stock: 0, isService: true },
    { id: 'LDIMM0484', name: 'E2 (ESTRADIOL)', price: 700, stock: 0, isService: true },
    { id: 'LDIMM0528', name: 'FERRITIN', price: 800, stock: 0, isService: true },
    { id: 'LDIMM0568', name: 'FOLATE/FOLIC ACID, SERUM', price: 1100, stock: 0, isService: true },
    { id: 'LDIMM0569', name: 'FOLLICLE STIMULATING HORMONE (FSH)', price: 650, stock: 0, isService: true },
    { id: 'LDIMM0723', name: 'HOMA IR (insulin resistance)', price: 1000, stock: 0, isService: true },
    { id: 'LDIMM0863', name: 'IMMUNOGLOBULIN IGE (TOTAL IGE)', price: 900, stock: 0, isService: true },
    { id: 'LDIMM0874', name: 'INSULIN (FASTING)', price: 850, stock: 0, isService: true },
    { id: 'LDIMM0879', name: 'INSULIN PP', price: 850, stock: 0, isService: true },
    { id: 'LDIMM0938', name: 'LUTEINIZING HORMONE (LH)', price: 600, stock: 0, isService: true },
    { id: 'LDIMM0963', name: 'Microalbumin Creatinine Ratio, Spot Urine', price: 700, stock: 0, isService: true },
    { id: 'LDIMM1025', name: 'NT-pro BNP', price: 3800, stock: 0, isService: true },
    { id: 'LDIMM1092', name: 'PROGESTERONE', price: 700, stock: 0, isService: true },
    { id: 'LDIMM1094', name: 'PROLACTIN', price: 650, stock: 0, isService: true },
    { id: 'LDIMM1096', name: 'PROSTATE SPECIFIC ANTIGEN, FREE (FREE PSA)', price: 850, stock: 0, isService: true },
    { id: 'LDIMM1097', name: 'PROSTATE SPECIFIC ANTIGEN, TOTAL (TOTAL PSA)', price: 950, stock: 0, isService: true },
    { id: 'LDIMM1110', name: 'PTH (INTACT)-PARATHYROID HORMONE', price: 1600, stock: 0, isService: true },
    { id: 'LDIMM1112', name: 'QUADRUPLE MARKER- SECOND TRIMESTER', price: 3500, stock: 0, isService: true },
    { id: 'LDIMM1186', name: 'TESTOSTERONE TOTAL', price: 800, stock: 0, isService: true },
    { id: 'LDIMM1191', name: 'THYROID PROFILE FREE', price: 1200, stock: 0, isService: true },
    { id: 'LDIMM1192', name: 'THYROID PROFILE TOTAL', price: 660, stock: 0, isService: true },
    { id: 'LDIMM1195', name: 'THYROID STIMULATING HORMONE (TSH), ULTRASENSITIVE', price: 350, stock: 0, isService: true },
    { id: 'LDIMM1212', name: 'Toxoplasma Antibodies panel', price: 1000, stock: 0, isService: true },
    { id: 'LDIMM1227', name: 'TRIPLE MARKER- SECOND TRIMESTER', price: 2900, stock: 0, isService: true },
    { id: 'LDIMM1268', name: 'VITAMIN B12 (CYANOCOBALAMIN)', price: 1210, stock: 0, isService: true },
    { id: 'LDIMM1274', name: 'VITAMIN D, 25 - OH', price: 1500, stock: 0, isService: true },
    { id: 'LDIMM1314', name: 'Dengue Fever Antibodies ( IgG, IgM) ELISA', price: 1870, stock: 0, isService: true },
    { id: 'LDIMM1320', name: 'FSH/LH/PROLACTIN', price: 1800, stock: 0, isService: true },
    { id: 'LDIMM1321', name: 'FT4 & TSH', price: 650, stock: 0, isService: true },
    { id: 'LDIMM1638', name: 'ANC PROFILE WITH TSH', price: 1750, stock: 0, isService: true },
    { id: 'LDIMU0072', name: 'AMH GOLD PLUS', price: 2500, stock: 0, isService: true },
    { id: 'LDLKP1592', name: 'Troponin I- Qualitative', price: 1900, stock: 0, isService: true },
    { id: 'LDMIC0040', name: 'AFB smear (Acid fast bacilli)', price: 300, stock: 0, isService: true },
    { id: 'LDMIC0417', name: 'CULTURE AND SENSITIVITY, AEROBIC- VITEK', price: 750, stock: 0, isService: true },
    { id: 'LDMIC0419', name: 'CULTURE AUTOMATED BLOOD AEROBIC- VITEK', price: 1500, stock: 0, isService: true },
    { id: 'LDMIC0424', name: 'CULTURE MTB, AUTOMATED', price: 950, stock: 0, isService: true },
    { id: 'LDMIC1327', name: 'STOOL CULTURE AND SENSITIVITY', price: 750, stock: 0, isService: true },
    { id: 'LDMIC1328', name: 'CULTURE AND SENSITIVITY, URINE- VITEK', price: 750, stock: 0, isService: true },
    { id: 'LDMICRO2028', name: 'Urine Culture & Sensitivity', price: 500, stock: 0, isService: true },
    { id: 'LDMOL0594', name: 'GENEXPERT MTB/RIF', price: 2800, stock: 0, isService: true },
    { id: 'LDMOL0637', name: 'HBV DNA PCR Quantitative, Real Time PCR', price: 5000, stock: 0, isService: true },
    { id: 'LDMOL0641', name: 'Hepatitis C (HCV) Viral RNA Genotype', price: 6800, stock: 0, isService: true },
    { id: 'LDMOL0645', name: 'HCV RNA PCR Quantitative, Real Time PCR', price: 6000, stock: 0, isService: true },
    { id: 'LDMOL0719', name: 'HLA B-27 by PCR', price: 2700, stock: 0, isService: true },
    { id: 'LDMOL0895', name: 'KARYOTYPING BY G BANDING', price: 3000, stock: 0, isService: true },
    { id: 'LDMOL1020', name: 'NON-INVASIVE PRENATAL TEST (NIPT)', price: 9990, stock: 0, isService: true },
    { id: 'LDMOL1183', name: 'TB DNA PCR, QUALITATIVE', price: 1980, stock: 0, isService: true },
    { id: 'LDMOL1466', name: 'H3 VIRAL MARKER PROFILE HIV, HBSAG,HCV', price: 1180, stock: 0, isService: true },
    { id: 'LDSER0141', name: 'ANA BY IMMUNOBLOT', price: 3300, stock: 0, isService: true },
    { id: 'LDSER0142', name: 'ANA IFA reflex to ANA Immunoblot', price: 2800, stock: 0, isService: true },
    { id: 'LDSER0143', name: 'ANA IFA, IN DILUTIONS', price: 1000, stock: 0, isService: true },
    { id: 'LDSER0145', name: 'ANCA Profile, ELISA', price: 2000, stock: 0, isService: true },
    { id: 'LDSER0149', name: 'HIV 1 & 2 ANTIBODIES, RAPID', price: 610, stock: 0, isService: true },
    { id: 'LDSER0154', name: 'ANTI CYCLIC CITRULLINATED PEPTIDE (CCP)', price: 2000, stock: 0, isService: true },
    { id: 'LDSER0172', name: 'Anti Phospholipid Antibodies (APA), IgG', price: 900, stock: 0, isService: true },
    { id: 'LDSER0173', name: 'Anti Phospholipid Antibodies (APA), IgM', price: 900, stock: 0, isService: true },
    { id: 'LDSER0185', name: 'Anti Streptolysin-O (ASO) Quantitative', price: 620, stock: 0, isService: true },
    { id: 'LDSER0188', name: 'ANTI TPO (THYROID PEROXIDASE) ANTIBODY)', price: 1500, stock: 0, isService: true },
    { id: 'LDSER0306', name: 'Cardiolipin Antibodies IgG, IgM', price: 1500, stock: 0, isService: true },
    { id: 'LDSER0464', name: 'Dengue NS1 Antigen, Rapid', price: 750, stock: 0, isService: true },
    { id: 'LDSER0521', name: 'FAECAL CALPROTECTIN', price: 3200, stock: 0, isService: true },
    { id: 'LDSER0618', name: 'H. Pylori Antibody IgG', price: 2000, stock: 0, isService: true },
    { id: 'LDSER0619', name: 'H. Pylori Antibody IgM', price: 2500, stock: 0, isService: true },
    { id: 'LDSER0652', name: 'HEPATITIS A VIRUS IGM ANTIBODY (HAV IGM)', price: 1100, stock: 0, isService: true },
    { id: 'LDSER0653', name: 'Hepatitis A Virus Total Antibody (HAV Total)', price: 1300, stock: 0, isService: true },
    { id: 'LDSER0656', name: 'HEPATITIS B SURFACE ANTIGEN (HBSAG), CLIA/ELISA', price: 1400, stock: 0, isService: true },
    { id: 'LDSER0657', name: 'HEPATITIS B SURFACE ANTIGEN (HBSAG), RAPID METHOD', price: 580, stock: 0, isService: true },
    { id: 'LDSER0663', name: 'Hepatitis B Virus core Total Antibody (HBc Total)', price: 1100, stock: 0, isService: true },
    { id: 'LDSER0665', name: 'Hepatitis B Virus envelope Antigen (HBeAg)', price: 900, stock: 0, isService: true },
    { id: 'LDSER0668', name: 'HEPATITIS C ANTIBODIES (HCV), RAPID', price: 500, stock: 0, isService: true },
    { id: 'LDSER0671', name: 'Hepatitis E Virus IgG Antibody (HEV IgG)', price: 1500, stock: 0, isService: true },
    { id: 'LDSER0672', name: 'HEPATITIS E VIRUS IGM ANTIBODY (HEV IGM)', price: 1500, stock: 0, isService: true },
    { id: 'LDSER1113', name: 'QUANTIFERON TB GOLD/INTERFERON GAMMA RELEASE ASSAY (IGRA)', price: 3000, stock: 0, isService: true },
    { id: 'LDSER1122', name: 'RHEUMATOID FACTOR(RA)', price: 650, stock: 0, isService: true },
    { id: 'LDSER1196', name: 'Tissue Transglutaminase (tTG) IgA Antibody', price: 1300, stock: 0, isService: true },
    { id: 'LDSER1201', name: 'TORCH 10 PROFILE', price: 3200, stock: 0, isService: true },
    { id: 'LDSER1234', name: 'Typhidot IgM', price: 550, stock: 0, isService: true },
    { id: 'LDSER1262', name: 'VDRL (RPR), Serum', price: 300, stock: 0, isService: true },
    { id: 'LDSER1288', name: 'WIDAL (SLIDE AGGLUTINATION)', price: 250, stock: 0, isService: true },
    { id: 'LDSER1322', name: 'Hb, TLC, DLC, Platelets', price: 300, stock: 0, isService: true },
    { id: 'LDSER1730', name: 'Typhidot , Salmonella IgG', price: 480, stock: 0, isService: true },
    { id: 'LDSER1810', name: 'H3 Viral marker profile HIV, HbsAg,HCV, Rapid', price: 1000, stock: 0, isService: true },
    { id: 'LDMOL0216', name: 'BCR/ABL Quantitative (International Scale)', price: 6500, stock: 0, isService: true },
    { id: 'LDIHC1674', name: 'IHC marker- ER, PgR, Her2neu', price: 3600, stock: 0, isService: true },
];

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useLocalStorage<Product[]>('billing_app_products', initialProducts);
  const [bills, setBills] = useLocalStorage<Bill[]>('billing_app_bills', []);
  const [settings, setSettings] = useLocalStorage<Settings>('billing_app_settings', {
    shopName: 'My Diagnostic Lab',
    address: '123 Health St, Wellness City',
    phone: '9876543210',
    gstin: 'YOUR_GSTIN_HERE',
    logo: '',
    upiId: 'your-upi-id@bank',
    printSize: '80mm'
  });

  const addProduct = useCallback((productData: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...productData, id: Date.now().toString() };
    setProducts(prev => [...prev, newProduct]);
  }, [setProducts]);

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  }, [setProducts]);
  
  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, [setProducts]);

  const getProductById = useCallback((id: string) => products.find(p => p.id === id), [products]);

  const addBill = useCallback((billData: Omit<Bill, 'id' | 'date'>): Bill => {
    const newBill: Bill = {
        ...billData,
        id: `INV-${Date.now()}`,
        date: new Date().toISOString()
    };
    setBills(prev => [newBill, ...prev]);

    setProducts(prevProducts => {
        const newProducts = [...prevProducts];
        let productsChanged = false;
        newBill.items.forEach(item => {
            const productIndex = newProducts.findIndex(p => p.id === item.productId);
            if (productIndex !== -1 && !newProducts[productIndex].isService) {
                newProducts[productIndex] = {
                    ...newProducts[productIndex],
                    stock: newProducts[productIndex].stock - item.quantity
                };
                productsChanged = true;
            }
        });
        return productsChanged ? newProducts : prevProducts;
    });
    
    return newBill;
  }, [setBills, setProducts]);

  const getBillById = useCallback((id: string) => bills.find(b => b.id === id), [bills]);

  const updateSettings = useCallback((newSettings: Settings) => {
    setSettings(newSettings);
  }, [setSettings]);

  const value = useMemo(() => ({
    products,
    bills,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    addBill,
    getBillById,
    updateSettings,
  }), [products, bills, settings, addProduct, updateProduct, deleteProduct, getProductById, addBill, getBillById, updateSettings]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};