import React, { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";

const API_URL = `${process.env.REACT_APP_API_HOST}/api/ask`;

type Analysis = {
  key_issues: string[];
  recommendations: string[];
  sentiment_percentages: {
    positive: number;
    neutral: number;
    negative: number;
  };
};

type Feedback = {
  browser: string;
  comments: string;
  feedback_id: string;
  id: string;
  line_of_business: string;
  msat_points: number;
  page: string;
  portal_type: string;
  survey_date: string;
  sentiment?: "Positive" | "Neutral" | "Negative";
  patterns?: string;
  potential_fixes?: string;
};

const COLORS = {
  blue: "#2979FF",
  blueDark: "#174ea6",
  magenta: "#F72585",
  teal: "#00C9A7",
  yellow: "#FFD166",
  purple: "#7209B7",
  navy: "#22223B",
  bg: "#fff",
  white: "#fff",
  gray: "#f0f1f6",
  orange: "#FF8800",
  pages: "#4dabf7",
  lobs: "#7209B7",
  browsers: "#FFD166",
};

const BAR_PALETTE = [
  "#2979FF", // blue
  "#FFD166", // yellow
  "#FF8800", // orange
  "#7209B7", // purple
  "#F72585", // magenta
  "#00C9A7", // teal
  "#be4bdb", // lavender
  "#4dabf7", // light blue
];

const SENTIMENT_COLORS = {
  Positive: COLORS.teal,
  Neutral: COLORS.yellow,
  Negative: COLORS.magenta,
};

export const UserFeedbackAnalytics: React.FC<{
  onSubmit: (input: string) => void;
  loading: boolean;
  messages: { sender: "user" | "copilot"; text: string; isSummary?: boolean }[];
}> = ({ onSubmit, loading, messages }) => {
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!input.trim() || loading) return;
    onSubmit(input);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSend();
  }

  return (
    <Paper
      sx={{
        width: "100%",
        maxWidth: 760,
        mx: "auto",
        mb: 4,
        p: 0,
        bgcolor: COLORS.white,
        borderRadius: 5,
        boxShadow: "0 8px 32px 0 #c5c9e6",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      elevation={0}
    >
      <Box sx={{ p: 3, borderBottom: "1px solid #e0e0ef", bgcolor: COLORS.blueDark }}>
        <Typography variant="h6" fontWeight={700} color="#fff" sx={{ fontSize: 20 }}>
          Analytics Copilot
        </Typography>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 3,
          bgcolor: COLORS.white,
          minHeight: 220,
          maxHeight: 340,
        }}
      >
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              mb: 2,
              textAlign: msg.sender === "user" ? "right" : "left",
            }}
          >
            <Box
              sx={{
                display: "inline-block",
                px: 2.5,
                py: 1.2,
                bgcolor: msg.isSummary
                  ? "#f3f6fa"
                  : msg.sender === "user"
                  ? COLORS.blue
                  : COLORS.gray,
                color: msg.isSummary
                  ? COLORS.navy
                  : msg.sender === "user"
                  ? "#fff"
                  : COLORS.navy,
                borderRadius: 3,
                maxWidth: "85%",
                fontSize: 16,
                fontWeight: "normal",
                whiteSpace: "pre-wrap",
                boxShadow: msg.sender === "user" ? 3 : undefined,
                border: msg.isSummary ? `1.5px solid ${COLORS.blue}` : undefined,
                letterSpacing: msg.isSummary ? 0.05 : undefined,
                lineHeight: 1.6,
              }}
            >
              {msg.text}
            </Box>
          </Box>
        ))}
        {loading && (
          <Box sx={{ textAlign: "left", mb: 1 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                px: 2,
                py: 1,
                bgcolor: COLORS.gray,
                color: COLORS.navy,
                borderRadius: 2,
                fontSize: 16,
              }}
            >
              <CircularProgress size={20} sx={{ mr: 1, color: COLORS.blue }} />
              Analyzing your request...
            </Box>
          </Box>
        )}
        <div ref={chatEndRef} />
      </Box>
      <Box sx={{ px: 3, pt: 1, pb: 0, bgcolor: COLORS.white }}>
        <Typography variant="body2" color={COLORS.navy} sx={{ opacity: 0.7 }}>
          <span role="img" aria-label="info">📅</span> Please enter the portal and a start and end date.<br />
          Example: <b>Show Portal ABC feedback from 2024-04-01 to 2024-05-31</b>
        </Typography>
      </Box>
      <Box display="flex" gap={2} p={3} borderTop="1px solid #e0e0ef" bgcolor={COLORS.gray}>
        <TextField
          size="small"
          fullWidth
          placeholder="Enter your analytics query here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          sx={{
            bgcolor: COLORS.white,
            input: { color: COLORS.navy },
            borderRadius: 2,
            "& fieldset": { borderColor: "#e5e9f2" },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={loading || !input.trim()}
          sx={{
            bgcolor: COLORS.blue,
            color: "#fff",
            fontWeight: 700,
            px: 4,
            "&:hover": { bgcolor: COLORS.blueDark },
            "&:disabled": { bgcolor: "#e0e0ef" },
            borderRadius: 2,
            boxShadow: 2,
            textTransform: "none",
          }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Analyze"}
        </Button>
      </Box>
    </Paper>
  );
};

function processCategoryData(data: Feedback[], key: keyof Feedback) {
  const counts = data.reduce((acc, item) => {
    const value = item[key] as string;
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export default function CopilotAnalyticsDashboard() {
  const [messages, setMessages] = useState<
    { sender: "user" | "copilot"; text: string; isSummary?: boolean }[]
  >([
    {
      sender: "copilot",
      text: "Hi! I'm your analytics copilot. Ask for a feedback summary, MSAT trends, or detailed entries.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCopilotSubmit(input: string) {
    setError(null);
    setLoading(true);
    setMessages((msgs) => [...msgs, { sender: "user", text: input }]);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: input }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.analysis && data.results?.[0]?.result) {
        setAnalysis(data.analysis);
        setFeedbackList(data.results[0].result);
        setMessages((msgs) => [
          ...msgs,
          {
            sender: "copilot",
            text: data.final_response,
            isSummary: true,
          },
          {
            sender: "copilot",
            text: "Here are your analytics and details!",
          },
        ]);
      } else {
        throw new Error("Received incomplete data from server.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to process your request. Please check your query format.";
      setError(errorMessage);
      setAnalysis(null);
      setFeedbackList([]);
    } finally {
      setLoading(false);
    }
  }

  const sentimentData = analysis?.sentiment_percentages
    ? [
        { name: "Positive", value: analysis.sentiment_percentages.positive },
        { name: "Neutral", value: analysis.sentiment_percentages.neutral },
        { name: "Negative", value: analysis.sentiment_percentages.negative },
      ]
    : [
        { name: "Positive", value: 0 },
        { name: "Neutral", value: 0 },
        { name: "Negative", value: 0 },
      ];

  const msatTrendData = feedbackList
    .map((fb) => ({
      date: fb.survey_date,
      msat_points: fb.msat_points,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const avgMsat =
    feedbackList.length > 0
      ? (
          feedbackList.reduce((sum, fb) => sum + fb.msat_points, 0) /
          feedbackList.length
        ).toFixed(2)
      : "-";

  const pageData = processCategoryData(feedbackList, "page");
  const lobData = processCategoryData(feedbackList, "line_of_business");
  const browserData = processCategoryData(feedbackList, "browser");

  function TruncatedTick(props: any) {
    const { x, y, payload } = props;
    const label = payload.value;
    const maxLen = 18;
    const display = label.length > maxLen ? label.slice(0, maxLen - 2) + "…" : label;
    return (
      <g transform={`translate(${x},${y})`}>
        <Tooltip title={label} placement="top">
          <text
            x={0}
            y={0}
            dy={16}
            textAnchor="end"
            fill="#444"
            fontSize={13}
            transform="rotate(-35)"
            style={{ fontFamily: "Inter, Roboto, Arial, sans-serif" }}
          >
            {display}
          </text>
        </Tooltip>
      </g>
    );
  }

  function renderColoredBars(data: { name: string; count: number }[]) {
    return (
      <Bar dataKey="count">
        {data.map((entry, idx) => (
          <Cell key={`cell-${idx}`} fill={BAR_PALETTE[idx % BAR_PALETTE.length]} />
        ))}
      </Bar>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: COLORS.bg,
        py: 3,
        px: { xs: 1, md: 6 },
        color: COLORS.navy,
        fontFamily: "Inter, Roboto, Arial, sans-serif",
      }}
    >
      <Typography
        variant="h5"
        fontWeight={800}
        sx={{
          mb: 2,
          color: COLORS.blueDark,
          letterSpacing: 0.5,
          textAlign: "center",
          fontSize: 24,
        }}
      >
        Enterprise Feedback Analytics
      </Typography>

      <UserFeedbackAnalytics
        onSubmit={handleCopilotSubmit}
        loading={loading}
        messages={messages}
      />

      {error && (
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography color="error" fontWeight={600} sx={{ fontSize: 16 }}>
            {error}
          </Typography>
        </Box>
      )}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
          <CircularProgress sx={{ color: COLORS.blueDark }} size={48} />
        </Box>
      )}

      {!loading && feedbackList.length > 0 && analysis && (
        <>
          <Box
            display="flex"
            gap={3}
            mb={3}
            flexWrap="wrap"
            justifyContent="center"
            maxWidth={1100}
            mx="auto"
          >
            <Paper
              sx={{
                flex: "1 1 220px",
                minWidth: 220,
                p: 3,
                bgcolor: COLORS.white,
                borderRadius: 3,
                boxShadow: "0 2px 12px 0 #c5c9e6",
                textAlign: "center",
                borderTop: `5px solid ${COLORS.teal}`,
              }}
            >
              <Typography fontSize={15} color={COLORS.magenta}>
                Total Feedback Comments
              </Typography>
              <Typography fontWeight={700} fontSize={26} color={COLORS.blue}>
                {feedbackList.length}
              </Typography>
            </Paper>
            <Paper
              sx={{
                flex: "1 1 220px",
                minWidth: 220,
                p: 3,
                bgcolor: COLORS.white,
                borderRadius: 3,
                boxShadow: "0 2px 12px 0 #c5c9e6",
                textAlign: "center",
                borderTop: `5px solid ${COLORS.purple}`,
              }}
            >
              <Typography fontSize={15} color={COLORS.blue}>
                Average MSAT
              </Typography>
              <Typography fontWeight={700} fontSize={26} color={COLORS.teal}>
                {avgMsat}
              </Typography>
            </Paper>
            <Paper
              sx={{
                flex: "1 1 220px",
                minWidth: 220,
                p: 3,
                bgcolor: COLORS.white,
                borderRadius: 3,
                boxShadow: "0 2px 12px 0 #c5c9e6",
                textAlign: "center",
                borderTop: `5px solid ${COLORS.magenta}`,
              }}
            >
              <Typography fontSize={15} color={COLORS.yellow}>
                Sentiment %
              </Typography>
              <Typography fontWeight={700} fontSize={20} color={COLORS.magenta}>
                {sentimentData.map((s) => `${s.value}%`).join(" / ")}
              </Typography>
            </Paper>
          </Box>

          <Box
            display="flex"
            gap={3}
            mb={3}
            flexWrap="wrap"
            justifyContent="center"
            maxWidth={1100}
            mx="auto"
          >
            <Paper
              sx={{
                flex: 1,
                minWidth: 300,
                p: 3,
                bgcolor: COLORS.white,
                borderRadius: 3,
                boxShadow: "0 2px 12px 0 #c5c9e6",
              }}
            >
              <Typography variant="h6" gutterBottom color={COLORS.magenta} fontSize={18}>
                Key Issues
              </Typography>
              <Box component="ul" sx={{ pl: 2, color: COLORS.navy }}>
                {analysis.key_issues.map((issue, index) => (
                  <li key={index} style={{ marginBottom: 8 }}>
                    <Typography variant="body2">{issue}</Typography>
                  </li>
                ))}
              </Box>
            </Paper>
            <Paper
              sx={{
                flex: 1,
                minWidth: 300,
                p: 3,
                bgcolor: COLORS.white,
                borderRadius: 3,
                boxShadow: "0 2px 12px 0 #c5c9e6",
              }}
            >
              <Typography variant="h6" gutterBottom color={COLORS.teal} fontSize={18}>
                Recommendations
              </Typography>
              <Box component="ul" sx={{ pl: 2, color: COLORS.navy }}>
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} style={{ marginBottom: 8 }}>
                    <Typography variant="body2">{rec}</Typography>
                  </li>
                ))}
              </Box>
            </Paper>
          </Box>

          <Box
            display="flex"
            flexWrap="wrap"
            gap={3}
            mb={3}
            justifyContent="center"
            maxWidth={1100}
            mx="auto"
          >
            <Paper
              sx={{
                flex: "1 1 340px",
                minWidth: 320,
                p: 3,
                bgcolor: COLORS.white,
                borderRadius: 3,
                boxShadow: "0 2px 12px 0 #c5c9e6",
              }}
            >
              <Typography variant="h6" gutterBottom color={COLORS.magenta} fontSize={18}>
                Sentiment Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {sentimentData.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={SENTIMENT_COLORS[entry.name as keyof typeof SENTIMENT_COLORS]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
            <Paper
              sx={{
                flex: "2 1 420px",
                minWidth: 420,
                p: 3,
                bgcolor: COLORS.white,
                borderRadius: 3,
                boxShadow: "0 2px 12px 0 #c5c9e6",
              }}
            >
              <Typography variant="h6" gutterBottom color={COLORS.blue} fontSize={18}>
                MSAT Points Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={msatTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gray} />
                  <XAxis dataKey="date" stroke={COLORS.navy} />
                  <YAxis stroke={COLORS.navy} />
                  <RechartsTooltip />
                  <Line
                    type="monotone"
                    dataKey="msat_points"
                    stroke={COLORS.purple}
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          <Box
            display="flex"
            flexWrap="wrap"
            gap={3}
            mb={3}
            justifyContent="center"
            maxWidth={1100}
            mx="auto"
          >
            <Paper sx={{ flex: "1 1 380px", minWidth: 320, p: 3, bgcolor: COLORS.white, borderRadius: 3, boxShadow: "0 2px 12px 0 #c5c9e6" }}>
              <Typography variant="h6" gutterBottom color={COLORS.pages} fontSize={18}>
                Top Pages (by Feedback Count)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={pageData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    tick={<TruncatedTick />}
                    height={60}
                  />
                  <YAxis allowDecimals={false} />
                  <RechartsTooltip />
                  {renderColoredBars(pageData)}
                </BarChart>
              </ResponsiveContainer>
            </Paper>
            <Paper sx={{ flex: "1 1 380px", minWidth: 320, p: 3, bgcolor: COLORS.white, borderRadius: 3, boxShadow: "0 2px 12px 0 #c5c9e6" }}>
              <Typography variant="h6" gutterBottom color={COLORS.lobs} fontSize={18}>
                Top Lines of Business
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={lobData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    tick={<TruncatedTick />}
                    height={60}
                  />
                  <YAxis allowDecimals={false} />
                  <RechartsTooltip />
                  {renderColoredBars(lobData)}
                </BarChart>
              </ResponsiveContainer>
            </Paper>
            <Paper sx={{ flex: "1 1 380px", minWidth: 320, p: 3, bgcolor: COLORS.white, borderRadius: 3, boxShadow: "0 2px 12px 0 #c5c9e6" }}>
              <Typography variant="h6" gutterBottom color={COLORS.browsers} fontSize={18}>
                Browser Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={browserData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    tick={<TruncatedTick />}
                    height={60}
                  />
                  <YAxis allowDecimals={false} />
                  <RechartsTooltip />
                  {renderColoredBars(browserData)}
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          <Paper
            sx={{
              mt: 3,
              p: 3,
              bgcolor: COLORS.white,
              color: COLORS.navy,
              borderRadius: 3,
              boxShadow: "0 2px 12px 0 #c5c9e6",
              maxWidth: 1100,
              mx: "auto",
            }}
          >
            <Typography variant="h6" gutterBottom color={COLORS.blue} fontSize={18}>
              Detailed Feedback
            </Typography>
            <Table size="small" sx={{ bgcolor: "transparent" }}>
              <TableHead>
                <TableRow sx={{ bgcolor: COLORS.gray }}>
                  <TableCell sx={{ color: COLORS.navy, fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ color: COLORS.navy, fontWeight: 700 }}>Browser</TableCell>
                  <TableCell sx={{ color: COLORS.navy, fontWeight: 700 }}>LOB</TableCell>
                  <TableCell sx={{ color: COLORS.navy, fontWeight: 700 }}>Page</TableCell>
                  <TableCell sx={{ color: COLORS.navy, fontWeight: 700 }}>MSAT</TableCell>
                  <TableCell sx={{ color: COLORS.navy, fontWeight: 700 }}>Comments</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {feedbackList.map((fb) => (
                  <TableRow key={fb.id} sx={{ bgcolor: "#fff" }}>
                    <TableCell sx={{ color: COLORS.navy }}>
                      {new Date(fb.survey_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ color: COLORS.navy }}>{fb.browser}</TableCell>
                    <TableCell sx={{ color: COLORS.navy }}>{fb.line_of_business}</TableCell>
                    <TableCell sx={{ color: COLORS.navy }}>{fb.page}</TableCell>
                    <TableCell>
                      <Chip
                        label={fb.msat_points}
                        sx={{
                          bgcolor:
                            fb.msat_points >= 7
                              ? COLORS.teal
                              : fb.msat_points >= 4
                              ? COLORS.yellow
                              : COLORS.magenta,
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: COLORS.navy }}>{fb.comments}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}
    </Box>
  );
}
