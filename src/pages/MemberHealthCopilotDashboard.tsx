import React, { useState, useRef } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Stack, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider, CircularProgress
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MedicationIcon from '@mui/icons-material/Medication';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';

const kpiCard = (
  label: string,
  value: React.ReactNode,
  icon: React.ReactNode,
  color: string,
  onClick: () => void
) => (
  <Paper
    onClick={onClick}
    sx={{
      p: 1.5,
      textAlign: 'center',
      flex: 1,
      minWidth: 120,
      background: color,
      color: '#fff',
      boxShadow: 1,
      cursor: 'pointer',
      transition: 'box-shadow 0.2s',
      '&:hover': { boxShadow: 4 }
    }}
  >
    <Box mb={0.5}>{icon}</Box>
    <Typography variant="body2" sx={{ fontWeight: 700 }}>{label}</Typography>
    <Typography variant="h5" sx={{ fontWeight: 900 }}>{value}</Typography>
  </Paper>
);

function sectionTitle(title: string) {
  return (
    <Typography
      variant="h5"
      sx={{
        fontWeight: 900,
        mt: 2,
        mb: 1,
        color: '#1976d2',
        letterSpacing: 1,
        textTransform: 'uppercase'
      }}
    >
      {title}
    </Typography>
  );
}

export const MemberHealthCopilotDashboard: React.FC = () => {
  const [memberId, setMemberId] = useState('');
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState<any | null>(null);
  const [hospitalResult, setHospitalResult] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Section refs for scrolling
  const claimsRef = useRef<HTMLDivElement>(null);
  const appointmentsRef = useRef<HTMLDivElement>(null);
  const medicationsRef = useRef<HTMLDivElement>(null);
  const immunizationsRef = useRef<HTMLDivElement>(null);

  // API call
  const fetchMember = async (input?: string) => {
    setLoading(true);
    setError(null);
    setMember(null);
    setHospitalResult(null);
    const ask = input || userInput;
    try {
    const res = await fetch(`${process.env.REACT_APP_API_HOST}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_input: `For member_id ${memberId}: ${ask}`,
        }),
      });
      const data = await res.json();
      // Check for hospital function in results
      const hospitalFn = data.results?.find((r: any) => r.function === 'hospital');
      if (hospitalFn && hospitalFn.result) {
        setHospitalResult(hospitalFn.result);
      } else if (data.analysis) {
        setMember(data.analysis);
      } else {
        setError('No data found for this member.');
      }
    } catch (e) {
      setError('Error fetching member data.');
    } finally {
      setLoading(false);
    }
  };

  // Chart data helpers for member
  const claimsByMonth = (member?.claim_summary || []).reduce((acc: Record<string, number>, claim: any) => {
    const month = claim.date?.slice(0, 7);
    if (!month) return acc;
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  const claimsChartData = Object.entries(claimsByMonth).map(([month, count]) => ({ month, claims: count }));

  return (
    <Box sx={{ background: '#fff', minHeight: '100vh', p: { xs: 1, md: 3 } }}>
      <Box sx={{ maxWidth: 950, mx: 'auto' }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#0d2357', mb: 2, letterSpacing: 1 }}>
          Member Health Copilot
        </Typography>
        <Paper sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Member ID"
              value={memberId}
              onChange={e => setMemberId(e.target.value)}
              size="small"
              sx={{ minWidth: 150 }}
              disabled={loading}
            />
            <TextField
              label="Ask Copilot"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              size="small"
              sx={{ minWidth: 250, flex: 1 }}
              placeholder='e.g. "Show my claims", "Show everything", "Show only appointments"'
              onKeyDown={e => { if (e.key === 'Enter') fetchMember(); }}
              disabled={loading}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => fetchMember()}
              disabled={loading || !memberId.trim() || !userInput.trim()}
              sx={{ fontWeight: 700, px: 3, py: 1, minWidth: 120 }}
            >
              {loading ? <CircularProgress size={22} /> : 'Ask'}
            </Button>
            {error && <Typography color="error" sx={{ ml: 2 }}>{error}</Typography>}
          </Stack>
        </Paper>

        {/* Hospital Results Rendering */}
        {hospitalResult && (
          <Box>
            {sectionTitle('Hospital Price Transparency')}
            <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Hospital Name</TableCell>
                      <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Hospital Address</TableCell>
                      <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Setting</TableCell>
                      <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Payer Name</TableCell>
                      <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Plan Name</TableCell>
                      <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Methodology</TableCell>
                      <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Procedure</TableCell>
                      <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {hospitalResult.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item.hospital_name}</TableCell>
                        <TableCell>
                          {Array.isArray(item.hospital_address)
                            ? item.hospital_address.join(', ')
                            : item.hospital_address}
                        </TableCell>
                        <TableCell>{item.setting || item.standard_charge?.setting}</TableCell>
                        <TableCell>{item.standard_charge?.payer_name}</TableCell>
                        <TableCell>{item.standard_charge?.plan_name}</TableCell>
                        <TableCell>{item.standard_charge?.methodology}</TableCell>
                        <TableCell>{item.standard_charge?.procedure}</TableCell>
                        <TableCell>
                          {typeof item.standard_charge?.price === 'number'
                            ? `$${item.standard_charge.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )}

        {/* Member Analysis Rendering */}
        {member && !hospitalResult && (
          <Box>
            <Paper sx={{ p: 2, mb: 2, borderRadius: 2, background: '#e3eafc', boxShadow: 1 }}>
              <Stack direction="row" spacing={4} alignItems="flex-start" flexWrap="wrap">
                <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 260 }}>
                  <Avatar sx={{ bgcolor: '#1976d2', width: 48, height: 48, fontSize: 24 }}>
                    {member.member_name?.[0] || 'M'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>{member.member_name}</Typography>
                    <Typography variant="body2" color="text.secondary">{member.gender}, {member.birth_date}</Typography>
                    <Typography variant="body2" color="text.secondary">{member.address?.street}, {member.address?.city}, {member.address?.state} {member.address?.zip}</Typography>
                    <Typography variant="body2" color="text.secondary">{member.email}</Typography>
                    <Typography variant="body2" color="text.secondary">Phone: {member.phone}</Typography>
                    <Typography variant="body2" color="text.secondary">PCP: {member.pcp_name}</Typography>
                    <Typography variant="body2" color="text.secondary">Plan: {member.plan_product_name} ({member.plan_type})</Typography>
                    <Typography variant="body2" color="text.secondary">Coverage: {member.coverage_effective_date} to {member.coverage_end_date}</Typography>
                  </Box>
                </Stack>
                {member.dependents && member.dependents.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#1565c0', mb: 1 }}>
                      Family & Dependents
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                      {member.dependents.map((dep: any, idx: number) => (
                        <Paper key={idx} sx={{ p: 1, minWidth: 140, background: '#fff', boxShadow: 0, mb: 1 }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <FamilyRestroomIcon color="primary" />
                            <Typography fontWeight={700}>{dep.name}</Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary">Relationship: {dep.relationship}</Typography>
                          <Typography variant="body2" color="text.secondary">Birth Date: {dep.birth_date}</Typography>
                          <Typography variant="body2" color="text.secondary">Subscriber ID: {dep.subscriber_id}</Typography>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Paper>

            {/* KPIs */}
            <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
              {kpiCard(
                'Claims',
                member.claim_summary?.length || 0,
                <AssignmentIndIcon fontSize="medium" />,
                '#1976d2',
                () => claimsRef.current?.scrollIntoView({ behavior: 'smooth' })
              )}
              {kpiCard(
                'Appointments',
                member.appointments?.length || 0,
                <EventAvailableIcon fontSize="medium" />,
                '#43a047',
                () => appointmentsRef.current?.scrollIntoView({ behavior: 'smooth' })
              )}
              {kpiCard(
                'Medications',
                member.medications?.length || 0,
                <MedicationIcon fontSize="medium" />,
                '#fbc02d',
                () => medicationsRef.current?.scrollIntoView({ behavior: 'smooth' })
              )}
              {kpiCard(
                'Immunizations',
                member.immunizations?.length || 0,
                <VaccinesIcon fontSize="medium" />,
                '#e53935',
                () => immunizationsRef.current?.scrollIntoView({ behavior: 'smooth' })
              )}
            </Stack>

            {/* Claims Section */}
            {member.claim_summary && member.claim_summary.length > 0 && (
              <div ref={claimsRef}>
                {sectionTitle('Claims')}
                <Paper sx={{ p: 1.5, borderRadius: 2, mb: 2 }}>
                  {claimsChartData.length > 1 && (
                    <Box mb={1} width="100%" height={140}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={claimsChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="claims" fill="#1976d2" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  )}
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Date</TableCell>
                          <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Claim ID</TableCell>
                          <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Status</TableCell>
                          <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Amount Billed</TableCell>
                          <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Amount Covered</TableCell>
                          <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Amount Paid</TableCell>
                          <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Department</TableCell>
                          <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Diagnosis</TableCell>
                          <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Procedure</TableCell>
                          <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Provider</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {member.claim_summary.map((c: any, idx: number) => (
                          <TableRow key={idx}>
                            <TableCell>{c.date}</TableCell>
                            <TableCell>{c.claim_id}</TableCell>
                            <TableCell>{c.status}</TableCell>
                            <TableCell>{c.amount_billed}</TableCell>
                            <TableCell>{c.amount_covered}</TableCell>
                            <TableCell>{c.amount_paid}</TableCell>
                            <TableCell>{c.department}</TableCell>
                            <TableCell>{c.diagnosis}</TableCell>
                            <TableCell>{c.procedure}</TableCell>
                            <TableCell>{c.provider}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </div>
            )}

            {/* Appointments Section */}
            {member.appointments && member.appointments.length > 0 && (
              <div ref={appointmentsRef}>
                {sectionTitle('Appointments')}
                <Paper sx={{ p: 1.5, borderRadius: 2, mb: 2 }}>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Date</TableCell>
                          <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Department</TableCell>
                          <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Location</TableCell>
                          <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Provider</TableCell>
                          <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Reason</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {member.appointments.map((a: any, idx: number) => (
                          <TableRow key={idx}>
                            <TableCell>{a.date}</TableCell>
                            <TableCell>{a.department}</TableCell>
                            <TableCell>{a.location}</TableCell>
                            <TableCell>{a.provider}</TableCell>
                            <TableCell>{a.reason}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </div>
            )}

            {/* Medications Section */}
            {member.medications && member.medications.length > 0 && (
              <div ref={medicationsRef}>
                {sectionTitle('Medications')}
                <Paper sx={{ p: 1.5, borderRadius: 2, mb: 2 }}>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Name</TableCell>
                          <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Dose</TableCell>
                          <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Frequency</TableCell>
                          <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Prescribed By</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {member.medications.map((m: any, idx: number) => (
                          <TableRow key={idx}>
                            <TableCell>{m.name}</TableCell>
                            <TableCell>{m.dose}</TableCell>
                            <TableCell>{m.frequency}</TableCell>
                            <TableCell>{m.prescribed_by}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </div>
            )}

            {/* Immunizations Section */}
            {member.immunizations && member.immunizations.length > 0 && (
              <div ref={immunizationsRef}>
                {sectionTitle('Immunizations')}
                <Paper sx={{ p: 1.5, borderRadius: 2, mb: 2 }}>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Date</TableCell>
                          <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Vaccine</TableCell>
                          <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>Provider</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {member.immunizations.map((i: any, idx: number) => (
                          <TableRow key={idx}>
                            <TableCell>{i.date}</TableCell>
                            <TableCell>{i.vaccine}</TableCell>
                            <TableCell>{i.provider}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </div>
            )}

            {/* Benefits Summary */}
            {member.benefits_summary && (
              <>
                {sectionTitle('Benefits Summary')}
                <Paper sx={{ p: 2, borderRadius: 2, mb: 2 }}>
                  <Box display="flex" flexWrap="wrap" gap={2}>
                    <Box minWidth={160}>
                      <Typography variant="subtitle2" fontWeight={700}>Medical</Typography>
                      <ul style={{ marginTop: 2, marginBottom: 0 }}>
                        {member.benefits_summary?.medical &&
                          Object.entries(member.benefits_summary.medical).map(([k, v]) =>
                            typeof v === 'string' ? <li key={k}><b>{k.replace(/_/g, ' ')}:</b> {v}</li> : null
                          )}
                      </ul>
                    </Box>
                    <Box minWidth={160}>
                      <Typography variant="subtitle2" fontWeight={700}>Dental</Typography>
                      <ul style={{ marginTop: 2, marginBottom: 0 }}>
                        {member.benefits_summary?.dental &&
                          Object.entries(member.benefits_summary.dental).map(([k, v]) =>
                            typeof v === 'string' ? <li key={k}><b>{k.replace(/_/g, ' ')}:</b> {v}</li> : null
                          )}
                      </ul>
                    </Box>
                    <Box minWidth={160}>
                      <Typography variant="subtitle2" fontWeight={700}>Vision</Typography>
                      <ul style={{ marginTop: 2, marginBottom: 0 }}>
                        {member.benefits_summary?.vision &&
                          Object.entries(member.benefits_summary.vision).map(([k, v]) =>
                            typeof v === 'string' ? <li key={k}><b>{k.replace(/_/g, ' ')}:</b> {v}</li> : null
                          )}
                      </ul>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" fontWeight={700}>Pharmacy</Typography>
                  <ul style={{ marginTop: 2, marginBottom: 0 }}>
                    {member.benefits_summary?.pharmacy &&
                      Object.entries(member.benefits_summary.pharmacy).map(([k, v]) =>
                        typeof v === 'string' ? <li key={k}><b>{k.replace(/_/g, ' ')}:</b> {v}</li> : null
                      )}
                  </ul>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" fontWeight={700}>Other Benefits</Typography>
                  <ul style={{ marginTop: 2, marginBottom: 0 }}>
                    {(member.benefits_summary?.other_benefits || []).map((b: string, idx: number) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                </Paper>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MemberHealthCopilotDashboard;
