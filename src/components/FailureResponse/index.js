import "./index.css";

function FailureResponse(props) {
  const { onClickRetry } = props;
  return (
    <div className="failure-container">
      <img
        src="https://as1.ftcdn.net/v2/jpg/03/85/26/86/1000_F_385268679_4nkxjOwtzy9aw5hQd4U8nqisOctxyddt.jpg"
        alt="failure Img"
        className="failure-img"
      />
      <p>Something went wrong Please try again</p>
      <button type="button" onClick={onClickRetry}>
        Retry
      </button>
    </div>
  );
}

export default FailureResponse;
