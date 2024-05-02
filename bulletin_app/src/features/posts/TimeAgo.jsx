import  {parseISO, formatDistanceToNow} from "date-fns"

const TimeAgo = ({ timestamp }) => {
    let timeago = ""
    if (timestamp) {
        const date = parseISO(timestamp)
        const timePeriod = formatDistanceToNow(date)
        timeago = `${timePeriod} ago`
    }

return (
    <span title={timestamp}>
        &nbsp; <i>{timeago}</i>
    </span>
)
}

export default TimeAgo