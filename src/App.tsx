// src/app/App.tsx
import PageRouter from '@/shared/components/PageRouter.tsx';
import { AuthProvider } from '@/context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="w-screen h-screen">
        <PageRouter />
      </div>
    </AuthProvider>
  );
}

export default App;



// import PageRouter from '@/shared/components/PageRouter.tsx';


// function App() {
//   return (
//     <div className='w-screen h-screen'>
//       <PageRouter />
//     </div>
//   );
// }

// export default App;
