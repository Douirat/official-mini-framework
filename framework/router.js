
export const createRouter = (store) => {
 
 const getRoute = () => {
   const hash = window.location.hash; 
  const route = hash.replace(/^#\//, ''); 
  return route || 'all'; 
  };

  
  const handleHashChange = () => {
    const route = getRoute();
    store.dispatch({
      type: 'SET_FILTER',
      payload: route,
    });
  };

 
  window.onhashchange = handleHashChange;

  handleHashChange();
};
