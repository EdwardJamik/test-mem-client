import React, {useEffect, useState} from 'react';
import {Button, Card, CardBody, CardFooter, CircularProgress, Image} from "@heroui/react";
import {Link} from "react-router-dom";
import LikeButton from '../../Components/LikeButton/LikeButton.jsx'
import {getDataFromCookies, saveDataToCookies} from "../../Hooks/cookieUtils.js";
import {generateRandomLikes} from "../../Hooks/randomLikes.js";
import {useModal} from "../../Context/ModalContext.jsx";

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

export const LinkIcon = ({size, ...props}) =>{
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={"currentColor"}
            viewBox="0 0 24 24"
            width={size}
            height={size}
        >
            <path fillRule="evenodd" d="M5,2 L7,2 C7.55228475,2 8,2.44771525 8,3 C8,3.51283584 7.61395981,3.93550716 7.11662113,3.99327227 L7,4 L5,4 C4.48716416,4 4.06449284,4.38604019 4.00672773,4.88337887 L4,5 L4,19 C4,19.5128358 4.38604019,19.9355072 4.88337887,19.9932723 L5,20 L19,20 C19.5128358,20 19.9355072,19.6139598 19.9932723,19.1166211 L20,19 L20,17 C20,16.4477153 20.4477153,16 21,16 C21.5128358,16 21.9355072,16.3860402 21.9932723,16.8833789 L22,17 L22,19 C22,20.5976809 20.75108,21.9036609 19.1762728,21.9949073 L19,22 L5,22 C3.40231912,22 2.09633912,20.75108 2.00509269,19.1762728 L2,19 L2,5 C2,3.40231912 3.24891996,2.09633912 4.82372721,2.00509269 L5,2 L7,2 L5,2 Z M21,2 L21.081,2.003 L21.2007258,2.02024007 L21.2007258,2.02024007 L21.3121425,2.04973809 L21.3121425,2.04973809 L21.4232215,2.09367336 L21.5207088,2.14599545 L21.5207088,2.14599545 L21.6167501,2.21278596 L21.7071068,2.29289322 L21.7071068,2.29289322 L21.8036654,2.40469339 L21.8036654,2.40469339 L21.8753288,2.5159379 L21.9063462,2.57690085 L21.9063462,2.57690085 L21.9401141,2.65834962 L21.9401141,2.65834962 L21.9641549,2.73400703 L21.9641549,2.73400703 L21.9930928,2.8819045 L21.9930928,2.8819045 L22,3 L22,3 L22,9 C22,9.55228475 21.5522847,10 21,10 C20.4477153,10 20,9.55228475 20,9 L20,5.414 L13.7071068,11.7071068 C13.3466228,12.0675907 12.7793918,12.0953203 12.3871006,11.7902954 L12.2928932,11.7071068 C11.9324093,11.3466228 11.9046797,10.7793918 12.2097046,10.3871006 L12.2928932,10.2928932 L18.584,4 L15,4 C14.4477153,4 14,3.55228475 14,3 C14,2.44771525 14.4477153,2 15,2 L21,2 Z"></path>
        </svg>
    )
}

const ListPage = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likedPosts, setLikedPosts] = useState({});
    const { openModal } = useModal();

    useEffect(() => {
        const likedPostsData = getDataFromCookies('likedPosts');
        if (likedPostsData) {
            setLikedPosts(likedPostsData);
        }

        const cachedMemsData = getDataFromCookies('cachedMems');

        if (cachedMemsData) {
            setList(cachedMemsData);
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

    const ImagePlaceholder = () => (
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
                <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 m-auto mt-10 mb-10 max-w-screen-2xl">
                    {list.map((item, index) => (
                        <Card key={index} isPressable shadow="sm" onPress={() => openModal({id:item?.id, title: item.title, img:item?.img, likedPosts, randomLikes: item.randomLikes})}>
                            <CardBody className="overflow-visible p-0 flex-none">
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
                                    <ImagePlaceholder/>
                                )}
                            </CardBody>
                            <CardFooter className='pt-0 h-full'>
                                <div className="w-full">
                                    <div className="flex flex-col flex-grow p-2">
                                        <p className='text-ellipsis text-left text-nowrap overflow-hidden text-lg' >{item.title}</p>
                                    </div>

                                    <div className='flex border-t-1 mt-auto h-9 pt-2'>
                                        <LikeButton
                                            postId={item.id}
                                            likedPosts={likedPosts}
                                            onLikeClick={handleLikeClick}
                                            likesCount={item.randomLikes}
                                        />
                                        <a href={item?.img} target="_blank" rel="noopener noreferrer"
                                           className="ml-auto">
                                            <Button
                                                color="primary"
                                                variant="faded"
                                                className='h-7 p-0 bg-transparent'
                                            >
                                                <LinkIcon size={18}/>
                                            </Button>
                                        </a>
                                    </div>

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