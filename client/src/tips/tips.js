  /*update count only when the component renders

  const [count, setCount] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setCount((count) => count + 1);
    }, 1000);
  }, []); // <- add empty brackets here
  <h1>I've rendered {count} times!</h1>
*/