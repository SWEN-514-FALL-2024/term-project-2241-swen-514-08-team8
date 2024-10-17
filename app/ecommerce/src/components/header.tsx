export default function Header() {
  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '10px',
        border: '1px solid black',
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
      }}
    >
      <h1>Ecommerce (Team8)</h1>
      <button>Home</button>
      <button>Page 2</button>
    </div>
  );
}
