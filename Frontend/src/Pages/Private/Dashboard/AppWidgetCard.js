import { styled } from "@mui/material/styles";
import { Box, Card, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import CircularProgress from "@mui/material/CircularProgress";

const StyledIcon = styled("div")(({ theme }) => ({
  margin: "auto",
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  width: theme.spacing(4),
  height: theme.spacing(4),
  justifyContent: "center",
  marginBottom: theme.spacing(1),
}));

export default function AppWidgetCard({
  title,
  total,
  active,
  inactive,
  icon,
  loading,
  color = "primary",
  sx,
  ...other
}) {
  function pxToRem(value) {
    return `${value / 16}rem`;
  }
  return (
    <Card
      sx={{
        py: 3,
        boxShadow: 0,
        textAlign: "center",
        color: "#061B64",
        bgcolor: "#D1E9FC",
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ display: "flex" }}>
        <div className="counter_card_flx">
          <div className="counter_card_cntnt">
            <div className="counter_card_txt">
              <h2
              sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: pxToRem(24) }}
            >
              {loading ? <CircularProgress /> : total}
            </h2>

            <Typography
              sx={{
                fontWeight: 600,
                lineHeight: 22 / 14,
                fontSize: pxToRem(14),
                opacity: 0.72,
              }}
            >
              {title}
            </Typography>
            </div>
            <div className="counter_card_icon"> 
              <StyledIcon
                sx={{
                  color: "#02b2af",
                }}
              >
                <Icon icon={icon} width={80} height={80} />
              </StyledIcon>
            </div>  
          </div>
          

         
        </div>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
