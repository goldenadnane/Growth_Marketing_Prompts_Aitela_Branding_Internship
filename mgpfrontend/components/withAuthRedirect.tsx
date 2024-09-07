// // components/withAuthRedirect.tsx

// import { useRouter } from "next/router";
// import { useEffect } from "react";

// const withAuthRedirect = (WrappedComponent: JSX.IntrinsicAttributes) => {
//   return (props: JSX.IntrinsicAttributes) => {
//     const router = useRouter();
//     const authStatus = useAuth();

//     useEffect(() => {
//       if (authStatus === null) {
//         // Checking auth status...
//         return;
//       }

//       if (!authStatus) {
//         // User is not authenticated, redirect to login page.
//         router.push("/auth/login");
//       }
//     }, [authStatus, router]);

//     // User is authenticated, render the wrapped component.
//     return <WrappedComponent {...props} />;
//   };
// };

// export default withAuthRedirect;
