import React, {useEffect, useState} from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button, Input,
} from "@heroui/react";
import { useModal } from "../../Context/ModalContext.jsx";
import {getDataFromCookies, saveDataToCookies} from "../../Hooks/cookieUtils.js";

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
            saveDataToCookies('cachedMemsTimestamp', new Date().getTime());
        }
        closeModal();
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} size="xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>{"Редагування"}</ModalHeader>
                        <ModalBody>
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
                                    onChange={(e) => setModalData({...modalData, randomLikes: parseInt(e.target.value) || 0})}
                                    placeholder="Лайки"
                                    min={0}
                                    type="number"
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Закрити
                            </Button>
                            <Button color="primary" onPress={handleSave}>
                                Зберегти
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default EditModal;