import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  TextField,
  Stack,
} from "@mui/material";
import { Person, Event, LocationOn, ChatBubble } from "@mui/icons-material";
import axios from "axios";
import Header from "../components/Home/Header";
import Footer from "../components/Home/Footer";
import { useNavigate } from "react-router-dom";
import ChatWidget from "../components/ChatApp";


const CaseStatusPage = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState("");
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const userId = "user110"; // Replace with actual user ID
  const token = "your_auth_token"; // Replace with actual token
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `https://p34mpb3lnc.execute-api.eu-west-2.amazonaws.com/User`,
          { userid: userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const responseData = JSON.parse(response.data.body || "{}");
        const filteredCases = responseData.items.filter(
          (item) => item.categoryid === 22
        );
        const formattedCases = filteredCases.map((caseItem) => ({
          ...caseItem,
          individualDetails: caseItem.individualdetails
            ? JSON.parse(caseItem.individualdetails) // Parse the individualdetails string to object
            : {},
        }));
        setCases(formattedCases);
      } catch (err) {
        setError("Failed to fetch cases. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [userId, token]);

  const handleWithdrawClick = (caseId) => {
    setSelectedCaseId(caseId);
    setWithdrawDialogOpen(true);
  };

  const handleWithdrawSubmit = async () => {
    console.log("Withdrawal submission initiated...");
  
    try {
      console.log("Finding the selected case...");
      const selectedCase = cases.find((caseItem) => caseItem.complaintid === selectedCaseId);
  
      if (!selectedCase) {
        console.error("Selected case not found!");
        alert("Case not found!");
        return;
      }
  
      console.log("Selected case details:", selectedCase);
  
      const payload = {
        complaintid: selectedCase.complaintid,
        categoryid: selectedCase.categoryid,
        userid: String(selectedCase.userid),
        policeid: String(selectedCase.policeid),
        reasonforwithdrawal: withdrawReason,
        iswithdrawalaccepted: selectedCase.iswithdrawalaccepted,
        iswithdrawn: 1, // Mark as withdrawn
        iscomplaintaccepted: selectedCase.iscomplaintaccepted,
        isfake: selectedCase.isfake,
        casestatus: selectedCase.casestatus,
        isfirfiled: selectedCase.isfirfiled,
        individualdetails: JSON.stringify(selectedCase.individualDetails || {}),
      };
  
      console.log("Payload to be sent:", payload);
  
      const response = await fetch(
        "https://p34mpb3lnc.execute-api.eu-west-2.amazonaws.com/User",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
  
      console.log("API response received. Status code:", response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from API:", errorData);
        throw new Error(errorData.message || "Failed to update complaint.");
      }
  
      const responseData = await response.json();
      console.log("API response data:", responseData);
  
      alert("Withdrawal reason submitted successfully.");
      console.log("Withdrawal reason submitted successfully.");
  
      setWithdrawDialogOpen(false);
      setWithdrawReason("");
    } catch (error) {
      console.error("Error occurred while submitting withdrawal reason:", error);
      alert("Failed to submit withdrawal reason. Please try again.");
    }
  };
  
  const handleVideoCall = (caseId) => {
    console.log(`Initiating video call for case ID: ${caseId}`);
    // Here you can integrate actual video call logic or navigate to a video call page
  };

  const handleDetailsOpen = (caseItem) => {
    setSelectedCase(caseItem);
    setDetailsDialogOpen(true);
  };

  const handleChat = (userId, policeId) => {
    setSelectedUser({ userId, policeId }); // Store the selected IDs
    setIsChatOpen(true); // Open the chat sidebar
  };

  const handleDetailsClose = () => {
    setDetailsDialogOpen(false);
  };
  
  
const [isChatOpen, setIsChatOpen] = useState(false); // Track if chat is open
const [selectedUser, setSelectedUser] = useState(null); // Store the selected user and police IDs


  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
          My Cases
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4 }}>
          View the complaints you’ve raised. Click "More Details" to explore further.
        </Typography>

        {loading && (
          <Box display="flex" justifyContent="center" mt={3}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && cases.length === 0 && (
          <Typography variant="body1" align="center" sx={{ mt: 3 }}>
            No cases found for your account.
          </Typography>
        )}

        {!loading && cases.length > 0 && (
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {cases.map((caseItem) => (
              <Grid item xs={12} sm={6} md={4} key={caseItem.complaintid}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                    overflow: "hidden",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": { transform: "scale(1.03)", boxShadow: "0 12px 28px rgba(0,0,0,0.2)" },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color: "#003366",
                        fontWeight: "bold",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}
                    >
                      Case ID: {caseItem.complaintid}
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                      Status: <strong>{caseItem.casestatus}</strong>
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                        mt: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Person sx={{ mr: 1 }} />
                        Victim: {caseItem.individualDetails.victim_name || "N/A"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Event sx={{ mr: 1 }} />
                        Incident Date:{" "}
                        {caseItem.individualDetails.date_of_incident || "N/A"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <LocationOn sx={{ mr: 1 }} />
                        Location: {caseItem.individualDetails.location || "N/A"}
                      </Typography>
                    </Box>

                    {/* Use Grid for Button Alignment */}
                    <Grid container spacing={2} sx={{ mt: 3 }}>
                      <Grid item xs={6}>
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                          onClick={() => handleDetailsOpen(caseItem)}
                          sx={{ width: "100%" }}
                        >
                          More Details
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          onClick={() => handleVideoCall(caseItem.complaintid)}
                          sx={{ width: "100%" }}
                        >
                          Video Call
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          variant="contained"
                          color="secondary"
                          sx={{ width: "100%" }}
                          onClick={() => handleWithdrawClick(caseItem.complaintid)}
                        >
                          Withdraw
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          variant="contained"
                          color="success"
                          sx={{ width: "100%" }}
                          onClick={() => handleChat(caseItem.userid, caseItem.policeid)}
                        >
                          <ChatBubble sx={{ mr: 1 }} /> Chat
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
        )}
        {/* ChatWidget */}
   {isChatOpen && selectedUser && (
  <ChatWidget
    connectionId={selectedUser.userId} // Pass user ID
    receiverId={selectedUser.policeId} // Pass police ID
    onClose={() => setIsChatOpen(false)} // Handle closing chat
  />
    )}
        {/* Withdrawal Dialog */}
        <Dialog
          open={withdrawDialogOpen}
          onClose={() => setWithdrawDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Withdraw Case</DialogTitle>
          <DialogContent>
            <TextField
              label="Reason for Withdrawal"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={withdrawReason}
              onChange={(e) => setWithdrawReason(e.target.value)}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setWithdrawDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleWithdrawSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Case Details Dialog */}
        <Dialog open={detailsDialogOpen} onClose={handleDetailsClose} maxWidth="md" fullWidth>
          <DialogTitle>Case Details</DialogTitle>
          <DialogContent>
            {selectedCase && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Case ID: {selectedCase.complaintid}
                </Typography>
                <Typography variant="body1">
                  Status: <strong>{selectedCase.casestatus}</strong>
                </Typography>
                <Typography variant="body2">
                  Victim Name: {selectedCase.individualDetails.victim_name || "N/A"}
                </Typography>
                <Typography variant="body2">
                  Victim Age: {selectedCase.individualDetails.victim_age || "N/A"}
                </Typography>
                <Typography variant="body2">
                  Victim Gender: {selectedCase.individualDetails.victim_gender || "N/A"}
                </Typography>
                <Typography variant="body2">
                  Suspect Name: {selectedCase.individualDetails.suspect_name || "N/A"}
                </Typography>
                <Typography variant="body2">
                  Incident Date: {selectedCase.individualDetails.date_of_incident || "N/A"}
                </Typography>
                <Typography variant="body2">
                  Description: {selectedCase.individualDetails.evidence_description || "N/A"}
                </Typography>
                <Typography variant="body2">
                  FIR Filed: {selectedCase.isfirfiled ? "Yes" : "No"}
                </Typography>
                <Typography variant="body2">
                  Withdrawn: {selectedCase.iswithdrawn ? "Yes" : "No"}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDetailsClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Footer />
    </div>
  );
};

export default CaseStatusPage;
