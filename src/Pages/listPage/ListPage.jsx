import React, {useEffect, useState} from 'react';
import {Card, CardBody, CardFooter, CircularProgress, Image} from "@heroui/react";
import {Link} from "react-router-dom";
import LikeButton from '../../Components/LikeButton/LikeButton.jsx'
import {getDataFromCookies, saveDataToCookies} from "../../Hooks/cookieUtils.js";
import {generateRandomLikes} from "../../Hooks/randomLikes.js";

export const ImageErrorIcon = ({ size = 24, ...props }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3" />
            <circle cx="12" cy="10" r="3" />
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        </svg>
    );
};

const ListPage = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likedPosts, setLikedPosts] = useState({});

    const CACHE_EXPIRY_TIME = 86400000;

    useEffect(() => {
        const likedPostsData = getDataFromCookies('likedPosts');
        if (likedPostsData) {
            setLikedPosts(likedPostsData);
        }

        const cachedMemsData = getDataFromCookies('cachedMems');
        const cachedTimestamp = getDataFromCookies('cachedMemsTimestamp');

        const currentTime = new Date().getTime();
        const isCacheValid = cachedMemsData && cachedTimestamp &&
            (currentTime - cachedTimestamp < CACHE_EXPIRY_TIME);

        if (isCacheValid) {
            const needsUpdate = !cachedMemsData.some(item =>
                'randomLikes' in item && 'isValidImage' in item
            );

            if (needsUpdate) {
                const updatedData = generateRandomLikes(cachedMemsData);
                setList(updatedData);
                saveDataToCookies('cachedMems', updatedData);
            } else {
                setList(cachedMemsData);
            }

            setLoading(false);
        } else {
            fetchMems();
        }
    }, []);

    const fetchMems = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API}/api/memList`);
            const data = await response.json();

            const processedPosts = generateRandomLikes(data);

            saveDataToCookies('cachedMems', processedPosts);
            saveDataToCookies('cachedMemsTimestamp', new Date().getTime());

            setList(processedPosts);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching mems:', error);
            setLoading(false);
        }
    };

    const handleLikeClick = (postId) => {
        const updatedLikedPosts = {...likedPosts};

        updatedLikedPosts[postId] = !updatedLikedPosts[postId];

        if (!updatedLikedPosts[postId]) {
            delete updatedLikedPosts[postId];
        }

        setLikedPosts(updatedLikedPosts);

        saveDataToCookies('likedPosts', updatedLikedPosts);
    };

    const ImagePlaceholder = ({title}) => (
        <div className="w-full h-[340px] bg-gray-200 flex flex-col items-center justify-center">
            <ImageErrorIcon size={48} className="text-gray-500 mb-2"/>
            <p className="text-gray-500">Некоректне зображення</p>
            <p className="text-gray-400 text-sm mt-1">(потрібен формат JPG)</p>
        </div>
    );

    return (
        <>
            {loading ?
                <CircularProgress style={{margin: '80px auto 0'}} aria-label="Loading..." size="lg"/>
                :
                <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                     style={{maxWidth: '1500px', margin: '20px auto 0'}}>
                    {list.map((item, index) => (
                        <Card key={index} isPressable shadow="sm" onPress={() => console.log("item pressed")}>
                            <CardBody className="overflow-visible p-0">
                                {item.img ? (
                                    <Image
                                        alt={item.title}
                                        className="w-full object-cover h-[340px]"
                                        radius="lg"
                                        shadow="sm"
                                        src={item.img}
                                        width="100%"
                                    />
                                ) : (
                                    <ImagePlaceholder title={item.title}/>
                                )}
                            </CardBody>
                            <CardFooter className="table-column">
                                <div className="flex text-small">
                                    <div className="flex flex-col flex-grow">
                                        <Link className="flex text-small" to={item.img}>
                                            <p className="text-default-500 mr-2">{item.id}.</p>
                                            <p className='ml-2 mr-2'>{item.title}</p>
                                        </Link>
                                        {!item.img && (
                                            <p className="text-xs text-red-500 mt-1">
                                                URL: {item.img}
                                            </p>
                                        )}
                                    </div>

                                        <LikeButton
                                            postId={item.id}
                                            likedPosts={likedPosts}
                                            onLikeClick={handleLikeClick}
                                            likesCount={item.randomLikes}
                                        />
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            }
        </>
    );
};

export default ListPage;