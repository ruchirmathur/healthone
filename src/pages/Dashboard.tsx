import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Avatar,
  IconButton,
  CircularProgress,
  Stack,
  Chip,
  Fade,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Send, Description as DescriptionIcon } from '@mui/icons-material';

interface ApplicationData {
  [key: string]: any;
}

interface ChatMessage {
  sender: string;
  message: string;
}

const getApplicantName = (row: ApplicationData) =>
  row['applicant_name'] || row['name'] || '';

const statusColors: Record<string, { bg: string; color: string }> = {
  Approved: { bg: '#e3fbe7', color: '#1b5e20' },
  Rejected: { bg: '#ffebee', color: '#b71c1c' },
  Pending: { bg: '#e3f2fd', color: '#1565c0' },
};

const getStatusChipProps = (status: string) => {
  const { bg, color } = statusColors[status] || { bg: '#e3eafc', color: '#1976d2' };
  return {
    label: status,
    sx: {
      bgcolor: bg,
      color: color,
      fontWeight: 600,
      px: 2,
      py: 0.5,
      borderRadius: 2,
      fontSize: '0.95em',
    },
    variant: 'filled' as const,
  };
};

const isApplicationsTable = (results: any[]): ApplicationData[] | null => {
  if (
    Array.isArray(results) &&
    results.length > 0 &&
    results[0].function === 'search_app_by_id' &&
    Array.isArray(results[0].result) &&
    results[0].result.length > 0 &&
    typeof results[0].result[0] === 'object'
  ) {
    return results[0].result as ApplicationData[];
  }
  return null;
};

const getDisplayValue = (row: ApplicationData, key: string) => {
  if (key.toLowerCase().includes('status')) {
    return <Chip {...getStatusChipProps(row[key])} />;
  }
  if (key.toLowerCase().includes('date')) {
    const date = new Date(row[key]);
    return isNaN(date.getTime()) ? row[key] : date.toLocaleDateString();
  }
  if (key === 'premium' && row[key]) {
    return <span>${String(row[key]).replace(/^\$/, '')}</span>;
  }
  if (key === 'document') {
    return row.document?.name || <i>No document</i>;
  }
  return row[key] ?? '';
};

const renderDetailsTable = (details: any) => {
  if (!details) return null;
  const renderSpouse = (spouse: any, label: string) => (
    <>
      <TableRow>
        <TableCell colSpan={2} sx={{ fontWeight: 700, bgcolor: '#e3f2fd', color: '#1565c0' }}>{label}</TableCell>
      </TableRow>
      {Object.entries(spouse).map(([k, v]: [string, any]) => (
        <TableRow key={k}>
          <TableCell sx={{ pl: 3 }}>{k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</TableCell>
          <TableCell>{v.value}</TableCell>
        </TableRow>
      ))}
    </>
  );
  return (
    <Table size="small" sx={{ border: '1px solid #e3eafc', mt: 1 }}>
      <TableBody>
        {Object.entries(details).map(([key, value]: [string, any]) => {
          if (key === 'spouse1' || key === 'spouse2') {
            return renderSpouse(value, key === 'spouse1' ? 'Spouse 1' : 'Spouse 2');
          }
          return (
            <TableRow key={key}>
              <TableCell sx={{ fontWeight: 600, color: '#1565c0', width: 180 }}>
                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </TableCell>
              <TableCell>{value.value}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

interface DocumentReviewDialogProps {
  open: boolean;
  docDetails: ApplicationData | null;
  onClose: () => void;
}

const DocumentReviewDialog: React.FC<DocumentReviewDialogProps> = ({
  open,
  docDetails,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !docDetails) return;

    const docId = docDetails.document?.doc_id || '';
    if (!docId) {
      setError('No document ID found.');
      setResult(null);
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    fetch(`${process.env.REACT_APP_API_HOST}/api/document-review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: docId }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        setResult(data);
      })
      .catch((err) => {
        setError(err.message || 'Failed to submit document review');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [open, docDetails]);

  if (!docDetails) return null;

  const docId = docDetails.document?.doc_id || '';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontSize: '1.2rem', color: '#1565c0', fontWeight: 700, letterSpacing: 0.5 }}>
        Document Review
      </DialogTitle>
      <DialogContent dividers sx={{ bgcolor: '#fff' }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="#1565c0" sx={{ fontWeight: 700 }}>
            Document Name
          </Typography>
          <Typography variant="body2">
            {docDetails.document?.name}
          </Typography>
          <Typography variant="subtitle2" color="#1565c0" sx={{ mt: 1, fontWeight: 700 }}>
            Document ID
          </Typography>
          <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
            {docId}
          </Typography>
        </Box>
        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <CircularProgress size={24} color="primary" />
            <Typography color="#1565c0">Submitting document review...</Typography>
          </Box>
        )}
        {result && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, color: '#1565c0', fontWeight: 700 }}>Extracted Details</Typography>
            {renderDetailsTable(result.details)}
            {result.document_url && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="#1565c0" sx={{ fontWeight: 700 }}>Document Image</Typography>
                <img
                  src={result.document_url}
                  alt="Document"
                  style={{ maxWidth: '100%', borderRadius: 8, marginTop: 8, border: '1px solid #e3eafc' }}
                />
              </Box>
            )}
          </Box>
        )}
        {error && (
          <Box sx={{ mt: 2, color: 'error.main' }}>
            <Typography>{error}</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ bgcolor: '#f5faff' }}>
        <Button onClick={onClose} variant="contained" sx={{ bgcolor: '#1565c0', color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#1976d2' } }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const Dashboard: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [apiTableData, setApiTableData] = useState<ApplicationData[] | null>(null);
  const [tableError, setTableError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [docReviewOpen, setDocReviewOpen] = useState(false);
  const [docReviewDetails, setDocReviewDetails] = useState<ApplicationData | null>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, loading, apiTableData]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const newMessage: ChatMessage = { sender: 'You', message: chatInput };
    setChatMessages((prev) => [...prev, newMessage]);
    setChatInput('');
    setLoading(true);
    setTableError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: chatInput }),
      });
      const data = await response.json();

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'Copilot',
          message: data.final_response || 'No summary available.',
        },
      ]);

      const tableData = isApplicationsTable(data.results);
      if (tableData && tableData.length > 0) {
        setApiTableData(tableData);
      } else {
        setApiTableData(null);
        setTableError('No application data found for your query.');
      }
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'Copilot', message: 'Error fetching response from server.' },
      ]);
      setApiTableData(null);
      setTableError('Error fetching application data.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading && chatInput.trim()) {
      handleSendMessage();
    }
  };

  const handleSEPReview = (row: ApplicationData) => {
    setDocReviewDetails(row);
    setDocReviewOpen(true);
  };

  const handleDocReviewClose = () => {
    setDocReviewOpen(false);
    setDocReviewDetails(null);
  };

  const tableHeaders: { key: string; label: string }[] = [
    { key: 'application_id', label: 'Application ID' },
    { key: 'applicant_name', label: 'Applicant Name' },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
    { key: 'create_date', label: 'Create Date' },
    { key: 'premium', label: 'Premium' },
    { key: 'document', label: 'Document' },
  ];

  const visibleHeaders =
    apiTableData && apiTableData.length > 0
      ? tableHeaders.filter((col) =>
          col.key === 'applicant_name'
            ? Object.keys(apiTableData[0]).includes('applicant_name') ||
              Object.keys(apiTableData[0]).includes('name')
            : Object.keys(apiTableData[0]).includes(col.key)
              || (col.key === 'document' && apiTableData[0].document)
        )
      : [];

  return (
    <Box sx={{
      padding: { xs: 1, md: 4 },
      minHeight: '100vh',
      background: '#fff',
      fontFamily: 'Inter, Roboto, Arial, sans-serif'
    }}>
      <Fade in>
        <Box>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: '#1565c0',
              letterSpacing: 0.5,
              mb: 2,
              fontSize: '1.15rem',
              fontFamily: 'Inter, Roboto, Arial, sans-serif'
            }}
          >
            AI Copilot for Underwriting
          </Typography>
          <Paper sx={{
            p: { xs: 1, md: 3 },
            borderRadius: 4,
            boxShadow: 4,
            maxWidth: 700,
            margin: '0 auto',
            background: '#fff',
            color: '#133b7c',
            border: '1px solid #e3eafc'
          }}>
            <Typography variant="subtitle1" sx={{ mb: 0.5, color: '#1565c0', fontWeight: 700 }}>
              Copilot Chat
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#1976d2',
                mb: 2,
                fontSize: '0.98em',
                fontStyle: 'italic',
                fontFamily: 'Inter, Roboto, Arial, sans-serif'
              }}
            >
              Ask about applications, statuses, types, names, or request a document review.
            </Typography>
            <Box sx={{
              maxHeight: '320px',
              minHeight: '100px',
              overflowY: 'auto',
              mb: 2,
              background: '#f5f8fa',
              borderRadius: 2,
              p: 2,
              border: '1px solid #e3eafc'
            }}>
              {chatMessages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    flexDirection: msg.sender === 'You' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Avatar sx={{
                    bgcolor: msg.sender === 'You' ? '#1565c0' : '#133b7c',
                    width: 28,
                    height: 28,
                    fontSize: 15,
                    ml: msg.sender === 'You' ? 2 : 0,
                    mr: msg.sender === 'You' ? 0 : 2,
                    color: '#fff',
                    border: msg.sender === 'You' ? '2px solid #e3eafc' : '2px solid #1565c0'
                  }}>
                    {msg.sender === 'You' ? 'U' : 'C'}
                  </Avatar>
                  <Box sx={{
                    maxWidth: '75%',
                    p: 1.2,
                    borderRadius: 2,
                    bgcolor: msg.sender === 'You' ? '#e3f2fd' : '#f5f8fa',
                    color: '#133b7c',
                    boxShadow: msg.sender === 'You' ? 2 : 1,
                    ml: msg.sender === 'You' ? 0 : 1,
                    mr: msg.sender === 'You' ? 1 : 0,
                    minWidth: 0,
                    border: msg.sender === 'You' ? '1.5px solid #1565c0' : '1.5px solid #e3eafc'
                  }}>
                    <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-word', fontSize: '0.97em' }}>
                      {msg.message}
                    </Typography>
                  </Box>
                </Box>
              ))}
              {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Avatar sx={{ bgcolor: '#133b7c', width: 28, height: 28, fontSize: 15, mr: 2, color: '#fff', border: '2px solid #1565c0' }}>C</Avatar>
                  <CircularProgress size={22} sx={{ mr: 2, color: '#1565c0' }} />
                  <Typography sx={{ color: '#1565c0', fontStyle: 'italic', fontSize: '0.97em' }}>
                    Copilot is typing...
                  </Typography>
                </Box>
              )}
              <div ref={chatEndRef} />
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your question..."
                fullWidth
                size="small"
                sx={{
                  background: '#fff',
                  borderRadius: 2,
                  '& .MuiInputBase-input': { color: '#133b7c' }
                }}
                InputLabelProps={{ style: { color: '#1565c0' } }}
                onKeyDown={handleKeyDown}
                disabled={loading}
                inputProps={{ style: { fontSize: '1em' } }}
              />
              <IconButton
                onClick={handleSendMessage}
                color="primary"
                disabled={loading || !chatInput.trim()}
                sx={{
                  ml: 1,
                  bgcolor: '#1565c0',
                  color: '#fff',
                  '&:hover': { bgcolor: '#1976d2' }
                }}
              >
                <Send fontSize="small" />
              </IconButton>
            </Stack>
          </Paper>
          {apiTableData && apiTableData.length > 0 && visibleHeaders.length > 0 && (
            <Fade in>
              <Paper sx={{
                mt: 5,
                p: { xs: 1, md: 3 },
                borderRadius: 4,
                boxShadow: 3,
                background: '#fff',
                maxWidth: 1200,
                margin: '40px auto 0 auto',
              }}>
                <Typography variant="subtitle1" sx={{
                  mb: 2,
                  color: '#1565c0',
                  fontWeight: 700,
                  fontSize: '1.02rem',
                  letterSpacing: 0.5,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  Applications
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ background: '#1565c0' }}>
                        {visibleHeaders.map((header) => (
                          <TableCell key={header.key} sx={{
                            fontWeight: 800,
                            color: '#fff',
                            textTransform: 'capitalize',
                            fontSize: '1em',
                            borderBottom: '2px solid #1976d2',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {header.label}
                          </TableCell>
                        ))}
                        <TableCell sx={{
                          fontWeight: 800,
                          color: '#fff',
                          textTransform: 'capitalize',
                          fontSize: '1em',
                          borderBottom: '2px solid #1976d2',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          Document Review
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apiTableData.map((row, rowIdx) => (
                        <TableRow key={rowIdx} hover>
                          {visibleHeaders.map((col) => (
                            <TableCell key={col.key} sx={{ fontSize: '0.96em', py: 1 }}>
                              {col.key === 'applicant_name'
                                ? getApplicantName(row)
                                : getDisplayValue(row, col.key)}
                            </TableCell>
                          ))}
                          <TableCell sx={{ fontSize: '0.96em', py: 1 }}>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              startIcon={<DescriptionIcon fontSize="small" />}
                              sx={{
                                fontWeight: 600,
                                fontSize: '0.92em',
                                borderRadius: 2,
                                minWidth: 'unset',
                                px: 1.2,
                                py: 0.5,
                                textTransform: 'none',
                                bgcolor: '#1565c0',
                                '&:hover': { bgcolor: '#1976d2' }
                              }}
                              onClick={() => handleSEPReview(row)}
                            >
                              Document Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Fade>
          )}
          {tableError && (
            <Box sx={{ mt: 4, textAlign: 'center', color: '#d32f2f', fontWeight: 600 }}>
              {tableError}
            </Box>
          )}
        </Box>
      </Fade>
      <DocumentReviewDialog
        open={docReviewOpen}
        docDetails={docReviewDetails}
        onClose={handleDocReviewClose}
      />
    </Box>
  );
};
export default Dashboard;
