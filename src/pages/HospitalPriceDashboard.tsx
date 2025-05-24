import React, { useState } from 'react';
import {
  Box, Typography, Paper, TextField, Button, CircularProgress,
  Accordion, AccordionSummary, AccordionDetails, Chip, Table, TableBody,
  TableCell, TableRow, TableHead, TableContainer, List, ListItem, ListItemText
} from '@mui/material';
import { LocalHospital, AttachMoney, LocationOn, ExpandMore, Info, Search } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const COLORS = ['#1976d2', '#00C49F', '#FFBB28', '#FF8042', '#ab47bc', '#ef5350', '#26a69a', '#ffa726'];

// Helper to safely format addresses
const formatAddress = (address: string[] | string | undefined): string =>
  Array.isArray(address) ? address.join(', ') : (typeof address === 'string' ? address : 'Address not available');

const formatPrice = (price: number | null | undefined) =>
  typeof price === 'number' && !isNaN(price)
    ? `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : <span style={{ color: '#999' }}>N/A</span>;

const getMin = (arr: (number | null | undefined)[]) => {
  const valid = arr.filter((v): v is number => typeof v === 'number' && !isNaN(v));
  return valid.length ? Math.min(...valid) : null;
};
const getMax = (arr: (number | null | undefined)[]) => {
  const valid = arr.filter((v): v is number => typeof v === 'number' && !isNaN(v));
  return valid.length ? Math.max(...valid) : null;
};
const getAvg = (arr: (number | null | undefined)[]) => {
  const valid = arr.filter((v): v is number => typeof v === 'number' && !isNaN(v));
  return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
};

type StandardCharge = {
  methodology: string;
  payer_name: string;
  plan_name: string;
  price: number | null;
  procedure: string;
  setting: string;
  discount?: boolean;
};

type HospitalResult = {
  hospital_address: string[] | string;
  hospital_name: string;
  setting: string;
  standard_charge: StandardCharge;
};

type PriceAnalysis = {
  best_prices: {
    hospital: string;
    address: string[] | string;
    payer: string;
    price: number | null;
    setting: string;
  }[];
  cost_saving_tips: string[];
  price_comparison: {
    hospital: string;
    payer: string;
    price: number | null;
    setting: string;
  }[];
};

type ApiResponse = {
  analysis: PriceAnalysis;
  final_response: string;
  results: { function: string; result: HospitalResult[] }[];
};

export const HospitalPriceDashboard: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [analysis, setAnalysis] = useState<PriceAnalysis | null>(null);
  const [finalResponse, setFinalResponse] = useState<string>('');
  const [hospitalResults, setHospitalResults] = useState<HospitalResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // API call
  const handleSearch = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    setError('');
    setAnalysis(null);
    setFinalResponse('');
    setHospitalResults([]);
    try {
      const response = await axios.post<ApiResponse>(
        `${process.env.REACT_APP_API_HOST}/api/ask`,
        { user_input: userInput }
      );
      setAnalysis(response.data.analysis);
      setFinalResponse(response.data.final_response);
      const hospitalFn = response.data.results?.find(r => r.function === 'hospital');
      setHospitalResults(hospitalFn?.result || []);
    } catch (err) {
      setError('Failed to fetch pricing data. Please check your connection and try again.');
    }
    setLoading(false);
  };

  // Chart data
  const priceData = (analysis?.price_comparison || [])
    .filter(item => typeof item.price === 'number')
    .map((item, idx) => ({
      name: item.hospital,
      value: item.price as number,
      fill: COLORS[idx % COLORS.length]
    }));

  const payerData = (analysis?.price_comparison || []).reduce((acc: Record<string, number>, item) => {
    acc[item.payer] = (acc[item.payer] || 0) + 1;
    return acc;
  }, {});

  const payerChartData = Object.entries(payerData).map(([name, value]) => ({ name, value }));

  const allPrices = (analysis?.price_comparison || []).map(p => p.price).filter(p => p !== null) as number[] || [];
  const minPrice = getMin(allPrices);
  const maxPrice = getMax(allPrices);
  const avgPrice = getAvg(allPrices);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', p: { xs: 1, sm: 2, md: 4 } }}>
      {/* Summary Section */}
      {finalResponse && (
        <Paper sx={{
          maxWidth: 950,
          mx: 'auto',
          p: 3,
          mb: 4,
          borderRadius: 4,
          bgcolor: '#fff',
          boxShadow: 3
        }}>
          <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 700, mb: 1 }}>
            Summary
          </Typography>
          <Typography variant="body1">{finalResponse}</Typography>
        </Paper>
      )}

      {/* Search Header */}
      <Paper sx={{
        maxWidth: 950,
        mx: 'auto',
        p: 4,
        mb: 4,
        borderRadius: 4,
        background: 'linear-gradient(135deg, #1976d2 0%, #90caf9 100%)',
        color: '#fff'
      }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <LocalHospital sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h3" sx={{ fontWeight: 900 }}>
            Hospital Price Transparency
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            Compare procedure costs across hospitals
          </Typography>
        </Box>
        <form onSubmit={e => { e.preventDefault(); handleSearch(); }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              alignItems: 'stretch',
              justifyContent: 'center'
            }}
          >
            <TextField
              fullWidth
              variant="filled"
              label="Search procedures"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ color: '#1976d2' }} />,
                style: { background: '#fff', color: '#222' }
              }}
              sx={{
                bgcolor: '#fff',
                borderRadius: 2,
                '& .MuiFilledInput-root': { color: '#222', background: '#fff' },
                '& .MuiInputLabel-root': { color: '#1976d2' }
              }}
              helperText="E.g. 'prostate biopsy', 'chest x-ray', CPT code, payer, or plan"
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              sx={{
                minWidth: 140,
                bgcolor: '#0d2357',
                color: '#fff',
                fontWeight: 700,
                '&:hover': { bgcolor: '#0a1a3c' }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Error */}
      {error && (
        <Typography color="error" sx={{ textAlign: 'center', mb: 2 }}>
          {error}
        </Typography>
      )}
      {/* Price Overview & Charts */}
      {analysis && (
        <Box sx={{ maxWidth: 950, mx: 'auto' }}>
          <Paper sx={{ p: 3, mb: 4, borderRadius: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, color: '#1976d2', fontWeight: 700 }}>
              Price Overview
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
              <Chip label={`Lowest: ${formatPrice(minPrice)}`} color="success" sx={{ fontWeight: 700 }} />
              <Chip label={`Highest: ${formatPrice(maxPrice)}`} color="error" sx={{ fontWeight: 700 }} />
              <Chip label={`Average: ${formatPrice(avgPrice)}`} color="warning" sx={{ fontWeight: 700 }} />
              <Chip label={`Hospitals compared: ${(analysis?.price_comparison || []).length}`} color="primary" sx={{ fontWeight: 700 }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1, minWidth: 300 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, color: '#1976d2', fontWeight: 700 }}>
                  Price by Hospital
                </Typography>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={priceData}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip formatter={(v: number) => `$${v}`} />
                    <Bar dataKey="value">
                      {priceData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ flex: 1, minWidth: 250 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, color: '#1976d2', fontWeight: 700 }}>
                  Payer Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={payerChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      label
                    >
                      {payerChartData.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Paper>

          {/* Best Prices */}
          <Paper sx={{ p: 3, mb: 4, borderRadius: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, color: '#1976d2', fontWeight: 700 }}>
              Best Price Options
            </Typography>
            {analysis.best_prices.map((hospital, index) => (
              <Accordion key={index} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {hospital.hospital}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <LocationOn sx={{ fontSize: 16, verticalAlign: 'middle' }} />
                        {formatAddress(hospital.address)}
                      </Typography>
                    </Box>
                    <Chip
                      label={formatPrice(hospital.price)}
                      color="success"
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 500 }}>Payer</TableCell>
                        <TableCell>{hospital.payer}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 500 }}>Setting</TableCell>
                        <TableCell>
                          <Chip
                            label={hospital.setting}
                            color={hospital.setting === 'inpatient' ? 'primary' : 'secondary'}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>

          {/* Comprehensive Price Table with Detailed Breakdown */}
          <Paper sx={{ p: 3, mb: 4, borderRadius: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, color: '#1976d2', fontWeight: 700 }}>
              Comprehensive Price Analysis Table
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              All payer, plan, methodology, price, and setting details for each hospital.
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Hospital</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Payer</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Plan</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Methodology</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Setting</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Procedure</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hospitalResults.map((item, idx) => {
                    const sc = item.standard_charge;
                    return (
                      <TableRow key={idx}>
                        <TableCell>{item.hospital_name}</TableCell>
                        <TableCell>{formatAddress(item.hospital_address)}</TableCell>
                        <TableCell>{sc?.payer_name}</TableCell>
                        <TableCell>{sc?.plan_name}</TableCell>
                        <TableCell>{sc?.methodology}</TableCell>
                        <TableCell>
                          <Chip
                            label={sc?.setting}
                            color={sc?.setting === 'inpatient' ? 'primary' : 'secondary'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{sc?.procedure}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                          {formatPrice(sc?.price)}
                          {sc?.discount && (
                            <Chip label="Discount" size="small" color="info" sx={{ ml: 1 }} />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="body2" sx={{ mt: 2, color: '#666', fontStyle: 'italic' }}>
              * All prices reflect payer-negotiated rates, plan, and setting, as required by the CMS Hospital Price Transparency Rule.
            </Typography>
          </Paper>
          {/* Cost Saving Tips */}
          {analysis.cost_saving_tips.length > 0 && (
            <Paper sx={{ p: 3, mb: 4, borderRadius: 4 }}>
              <Typography variant="h5" sx={{ mb: 3, color: '#1976d2', fontWeight: 700 }}>
                Cost Saving Tips
              </Typography>
              <List>
                {analysis.cost_saving_tips.map((tip, index) => (
                  <ListItem key={index} sx={{ alignItems: 'flex-start' }}>
                    <Info sx={{ color: '#1976d2', mt: 0.5, mr: 2 }} />
                    <ListItemText primary={tip} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );
};

export default HospitalPriceDashboard;
