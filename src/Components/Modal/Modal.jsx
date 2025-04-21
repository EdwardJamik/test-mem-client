import React, {useEffect, useState} from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button, Input, Image,
} from "@heroui/react";
import { useModal } from "../../Context/ModalContext.jsx";
import {getDataFromCookies, saveDataToCookies} from "../../Hooks/cookieUtils.js";
import {Link} from "react-router-dom";
import LikeButton from "../LikeButton/LikeButton.jsx";
import {LinkIcon} from "../../Pages/ListPage/ListPage.jsx";

const EditModal = () => {
    const { isOpen, closeModal, data } = useModal();
    const [modalData, setModalData] = useState({});

    useEffect(() => {
        if (data) {
            setModalData({...data});
        }
    }, [data]);

    const handleSave = () => {
        const cachedMems = getDataFromCookies('cachedMems') || [];

        const index = cachedMems.findIndex(item => item.id === modalData.id);

        if (index !== -1) {
            const updatedMems = [...cachedMems];
            updatedMems[index] = modalData;

            saveDataToCookies('cachedMems', updatedMems);
        }
        closeModal();
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} size="xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>{modalData?.img ? "" : "Редагування"}</ModalHeader>
                        <ModalBody>
                            {modalData?.img ?
                                <>
                                    <Image
                                        alt={modalData.title}
                                        className="w-full min-h-40 object-cover"
                                        radius="lg"
                                        shadow="sm"
                                        src={modalData?.img}
                                        width="100%"
                                    />
                                    <div className="w-full">
                                        <div className="flex flex-col flex-grow ">
                                            <p className='text-ellipsis h-8 text-nowrap overflow-hidden text-lg'>{modalData.title}</p>
                                        </div>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                                        <Input
                                            label="Назва"
                                            value={modalData?.title || ''}
                                            onChange={(e) => setModalData({...modalData, title: e.target.value})}
                                            placeholder="Назва"
                                            type="text"
                                        />
                                    </div>
                                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                                        <Input
                                            label="Лайки"
                                            value={modalData?.randomLikes || 0}
                                            onChange={(e) => setModalData({
                                                ...modalData,
                                                randomLikes: parseInt(e.target.value) || 0
                                            })}
                                            placeholder="Лайки"
                                            min={0}
                                            type="number"
                                        />
                                    </div>
                                </>
                            }
                        </ModalBody>
                        <ModalFooter>
                            {modalData?.img ?
                                <></>
                                :
                                <>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Закрити
                                    </Button>
                                    <Button color="primary" onPress={handleSave}>
                                        Зберегти
                                    </Button>
                                </>
                            }
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default EditModal;