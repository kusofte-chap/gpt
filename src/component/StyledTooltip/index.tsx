import { TooltipProps, styled, tooltipClasses, Tooltip } from "@mui/material";

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#263238',
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: '20px',
        padding: '4px 8px',
        borderRadius: '6px',
        color: '#fff'
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: '#263238',
    },
}));

export default StyledTooltip