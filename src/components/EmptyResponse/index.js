import "./index.css";

function EmptyResponse() {
  return (
    <div className="empty-response-container">
      <img
        src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-536.jpg?t=st=1723231140~exp=1723234740~hmac=4910a3863c97bde5a1f5df56dd9d95e446f05fdac2ee3eb68daecaf7ce295f54&w=740"
        alt="empty result img"
        className="empty-result-image"
      />
      <p>No result</p>
    </div>
  );
}

export default EmptyResponse;
