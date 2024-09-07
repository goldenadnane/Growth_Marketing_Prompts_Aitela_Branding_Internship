// import { useEffect } from 'react';
// import { useRouter } from 'next/router';
// import jwt from 'jsonwebtoken';

function useRoleCheck(targetPath: string) {
//   const router = useRouter();

//   useEffect(() => {
//     // Get token from localStorage
//     const token = localStorage.getItem('token');
//     if (token) {
//       console.log('TOKEN : ', token);
      
//       const decoded = jwt.verify(actualToken, '3ZcVbqSv6vyXJ2LX7HmJ8Vv3F7bQd5XK');
      
//       const role = decoded.sub;
//       if (role=== 'user' && targetPath.startsWith('/admin/')) {
//         // Redirect to a safe page, change '/' to any safe page you'd like.
//         router.push('/');
//       }
//     } else {
//       // Handle no token scenario, maybe redirect to login
//       router.push('/login');
//     }
//   }, []);
}

export default useRoleCheck;
