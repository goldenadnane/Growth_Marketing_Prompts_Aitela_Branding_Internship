import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateProfileLogo from './profile';
import Image from 'next/image';

const UserProfilePage = () => {
    const router = useRouter();
    const { id } = router.query;

    const [user, setUser] = useState<userInfo | null>(null);

    useEffect(() => {
        // Fetch user data using the 'id' from the URL
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${id}`);
                setUser(response.data);
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };

        if (id) {
            fetchUser();
        }
    }, [id]);

    return (
        <div>
            {user ? (
                <div>
                    <h1>User Profile</h1>
                    <p>Username: {user?.username}</p>
                    <p>Email: {user?.email}</p>
                    <p>firstname: {user?.firstname}</p>
                    <p>lastname: {user?.lastname}</p>

                    {/* Display profile_logo as an image */}

                    {user?.profileLogo && <Image src={`/assets/images/${user?.profileLogo}`} alt="Profile Logo" width={200} height={200} />}

                    {/* Display other user profile information */}
                    <UpdateProfileLogo id={user?.id} />
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default UserProfilePage;
