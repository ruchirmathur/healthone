import React from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const TablePage: React.FC = () => {
  const rows = [
    { name: 'ClaimForm_2025', status: 'Completed', score: '99%' },
    { name: 'ClaimForm_2024', status: 'Verified', score: '98%' },
    { name: 'ClaimForm_2023', status: 'Pending', score: '95%' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Table Page
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TablePage;