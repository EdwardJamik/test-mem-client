import React, { useEffect, useState, useCallback } from 'react';

import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Tooltip, Button,
} from "@heroui/react";
import { useModal } from "../../Context/ModalContext.jsx";
import LikeButton from "../../Components/LikeButton/LikeButton.jsx";
import {getDataFromCookies, saveDataToCookies} from "../../Hooks/cookieUtils.js";
import {generateRandomLikes} from "../../Hooks/randomLikes.js";

export const EditIcon = (props) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 20 20"
            width="1em"
            {...props}
        >
            <path
                d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.5}
            />
            <path
                d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.5}
            />
            <path
                d="M2.5 18.3333H17.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.5}
            />
        </svg>
    );
};

const TablePage = () => {
    const { openModal } = useModal();
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likedPosts, setLikedPosts] = useState({});

    const CACHE_EXPIRY_TIME = 86400000;

    useEffect(() => {
        const savedLikes = getDataFromCookies('likedPosts');
        if (savedLikes) {
            setLikedPosts(savedLikes);
        }
    }, []);

    const handleLikeClick = useCallback((postId) => {
        setLikedPosts(prevState => {
            const updatedLikes = { ...prevState };
            updatedLikes[postId] = !updatedLikes[postId];

            if (!updatedLikes[postId]) {
                delete updatedLikes[postId];
            }

            saveDataToCookies('likedPosts', updatedLikes);

            return updatedLikes;
        });
    }, []);

    useEffect(() => {
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
    }, [likedPosts,list]);

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

    const renderCell = useCallback((item, columnKey) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "title":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">{item.title}</p>
                    </div>
                );
            case "like":
                return (
                    <div className="m-auto max-w-21">
                        <LikeButton
                            postId={item.id}
                            likedPosts={likedPosts}
                            onLikeClick={handleLikeClick}
                            likesCount={item.randomLikes}
                        />
                    </div>
                );
            case "actions":
                return (
                    <div className="relative flex items-center justify-center">
                        <Tooltip content="Edit">
                            <Button onPress={()=>openModal(item)} className="w-10 h-10 p-0 min-w-0">
                                <EditIcon />
                            </Button>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, [likedPosts, handleLikeClick]);

    return (
        <div className="max-w-7xl mx-auto px-4">
            <Table aria-label="Table of memes">
                <TableHeader columns={[
                    { name: "id", uid: "id" },
                    { name: "Назва", uid: "title" },
                    { name: "Лайки", uid: "like" },
                    { name: "ACTIONS", uid: "actions" },
                ]}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" || column.uid === "like" || column.uid === "id" ? "center" : "start"}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={list} isLoading={loading} loadingContent="Завантаження...">
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default TablePage;