import React, { useState } from 'react';
import axios from 'axios';
import ComplaintFormStep1 from './ComplaintFormStep1';
import ComplaintFormStep2 from './ComplaintFormStep2';
import ComplaintFormStep3 from './ComplaintFormStep3';
import ComplaintFormStep4 from './ComplaintFormStep4';
import Header from '../Home/Header';
import Footer from '../Home/Footer';
import './ComplaintForm.styles.css';
import { Stepper, Step, StepLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { StepConnector } from '@mui/material';
import { styled } from '@mui/material/styles';

function ComplaintForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    complaintCategory: '',
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    address: '',
    victimName: '',
    victimAge: '',
    victimGender: '',
    suspectName: '',
    location: '',
    dateOfIncident: '',
    evidenceDescription: '',
    evidenceFiles: [],
  });
const steps = ['Personal Details', 'Victim Information', 'Suspect Details', 'Review & Submit'];
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);


  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    if (isSubmitting) return; // Exit early if submission is already in progress

  setIsSubmitting(true); // Set submitting to true to prevent further submissions
    console.log('Submitting final form data...');
    console.log('Form Data:', formData);
  
    try {
      
      // Step 2: Prepare individual details
      const individualDetails = JSON.stringify({
        complaint_category: formData.complaintCategory,
        victim_name: formData.victimName,
        victim_age: formData.victimAge,
        victim_gender: formData.victimGender,
        suspect_name: formData.suspectName,
        date_of_incident: formData.dateOfIncident,
        evidence_description: formData.evidenceDescription,
        location: formData.location,
      });
      console.log('Individual details:', individualDetails);
  
      // Step 3: Prepare payload for complaint submission
      const payload = {
        categoryid: 22,
        userid: "user110",
        policeid: "user182",
        reasonforwithdrawal: null,
        iswithdrawalaccepted: 0,
        iswithdrawn: 0,
        iscomplaintaccepted: 1,
        casestatus: 'under investigation',
        isfirfiled: 1,
        individualdetails: individualDetails,
      };
      console.log('Payload to be sent:', payload);
      const token ='eyJraWQiOiJPMGgyenNCR2lacnlSTzBkNklqdDI1SzdteldpREJKejdhK0lBV2R6XC9yVT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJkOGExMjMzMC1kMGExLTcwOGMtYTljNC1mMTk1NDQ0MDJmMGQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYmlydGhkYXRlIjoiMjAwMi0wOS0xOSIsImdlbmRlciI6Im1hbGUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9RUHVKZk9hRmMiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOmZhbHNlLCJjb2duaXRvOnVzZXJuYW1lIjoiZDhhMTIzMzAtZDBhMS03MDhjLWE5YzQtZjE5NTQ0NDAyZjBkIiwib3JpZ2luX2p0aSI6IjBkODU0YTI0LWM4YjMtNGYxYy1iNTIxLWIyODJhMmI5NjUzNCIsImF1ZCI6IjJtbnYxN3ZvYTdlOHE2YmFubGcwajBxdGgiLCJldmVudF9pZCI6IjQ3ZjU5YmE0LTFkYzktNGM4ZS1iMGFlLWFhYTFiMDRlMzZkMSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzMxODM2Njc2LCJuYW1lIjoiU2FhYmlxIiwicGhvbmVfbnVtYmVyIjoiKzkxOTUwMDI2OTc4NiIsImV4cCI6MTczMTkyMzA3NiwiaWF0IjoxNzMxODM2Njc2LCJqdGkiOiJkZTAxZWJlYS1iNDJhLTRjZjktODAzNS1lODkxZjYyMjNiZDEiLCJlbWFpbCI6InNhYWJpcWFoYW1lZDIzQGdtYWlsLmNvbSJ9.Qi6C5jgO2hxz5LQBhoblbCBxDrdoWVNJAW9x9weJSS2omQ3QLvc8uApioi0lHC6vlQpu9qH7ehZUC2t1fL8DMOZcUiATlADAn4SoyrM4ozkILL1ZWB9Ihp_lm6PR_C75CBuq2oYlppkmr5efuCFEw-Hl7w66evgwf9SSqzBqDM00pxy3t3pbgAuuBBJLeOZmtAjI59yi79qTF77cUJjXAeQnLPn2YlIfKHNDMjaxfBFRZKeewhiM20hdFgFX813oEfTxYAdovKLUPKvsUusZxkOWwRzxeayPWBFko54jPNtnpK0IgfFmnqNxE4aI9KHv2w2fz17zGb2325i3SrOEcA';
      // Step 4: Submit complaint data to backend
      const response = await axios.post(
        'https://x4xn6amqo2.execute-api.eu-west-2.amazonaws.com/UserComplaints',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Replace with your actual token variable
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Complaint submitted successfully:', response.data);
  
      // Step 5: Extract complaint ID from response
      const responseBody = JSON.parse(response.data.body);
      const complaintId = responseBody.data.complaintid;
  
      // Step 6: Upload evidence files to complaint folder
      for (let file of formData.evidenceFiles) {
        const folderName = `${complaintId}`; // Use complaint ID as folder name
        const evidencePayload = {
          folderName: folderName,
          fileName: file.name, // Assuming `file` is a File object
          fileType: file.type,
          isEvidence: true,
        };
        console.log('Evidence payload:', evidencePayload);
  
        try {
          // Generate pre-signed URL for the file upload
          const uploadResponse = await axios.post(
            'https://kz6gmd08a6.execute-api.ap-northeast-2.amazonaws.com/dev/uploadvideo',
            { body: evidencePayload },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
  
          if (uploadResponse.status === 200) {
            const preSignedUrl = JSON.parse(uploadResponse.data.body).url;
            console.log('Pre-signed URL:', preSignedUrl);
  
            // Upload the file to the pre-signed URL
            await axios.put(preSignedUrl, file, {
              headers: {
                'Content-Type': file.type,
              },
            });
  
            console.log(`Evidence file ${file.name} uploaded successfully`);
          } else {
            console.error('Error generating pre-signed URL:', uploadResponse.data.error);
          }
        } catch (uploadError) {
          console.error('Error uploading evidence:', uploadError);
        }
      }
  
      alert('Complaint submitted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('An error occurred during submission.');
    }
    finally {
      setIsSubmitting(false); // Reset submission state after completion
    }
  };
  
  return (
    <div className="page-container">
      <Header />
      <div className="form-container">
        <Stepper activeStep={step - 1} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
  
        <div className="form-step-container">
          {step === 1 && (
            <ComplaintFormStep1
              nextStep={nextStep}
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {step === 2 && (
            <ComplaintFormStep2
              nextStep={nextStep}
              prevStep={prevStep}
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {step === 3 && (
            <ComplaintFormStep3
              nextStep={nextStep}
              prevStep={prevStep}
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {step === 4 && (
  <ComplaintFormStep4
    prevStep={prevStep}
    formData={formData}
    handleSubmit={handleSubmit}
    isSubmitting={isSubmitting}  // Pass the state to child component
    setIsSubmitting={setIsSubmitting}  // Pass the setter to child component
  />
)}

        </div>
      </div>
      <Footer />
    </div>
  );  
}

export default ComplaintForm;