import React from 'react'
import { Badge, Group, Text, Button } from '@mantine/core'
import { FaShare } from 'react-icons/fa';
import { FiEdit, FiMapPin, FiTrash2 } from "react-icons/fi";
import { 
    PiBedFill, 
    PiBathtubFill, 
    PiTriangleFill,
} from "react-icons/pi";
import getCountryFromGoogleMapsUrl from '../../../Functions/getCountryFromGoogleMapsUrl';
import numberToWords from '../../../Functions/numberToWords';
import { IoPricetagsOutline } from "react-icons/io5";
import { useAddFavoriteMutation, useDeleteFavoriteMutation } from '../../../Store/Favorite/FavoriteApi';
import { showNotification } from '../../../utils/notification';
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io';
import { useAuth } from '../../../hooks/useAuth';
import { useDeletePropertyMutation } from '../../../Store/Properites/PropertiesApi';
import { useNavigate } from 'react-router-dom';

const LeftCard = ({singleProperty, setIsShareModalOpen, refetchDetails, refetchListing}) => {
    const navigate = useNavigate();
    const{userChecked} = useAuth();
    const [addFavorite, { isLoading: isLoadingAddFavorite }] = useAddFavoriteMutation();
    const [deleteFavorite, { isLoading: isLoadingDeleteFavorite }] = useDeleteFavoriteMutation();
    const [deleteProperty, { isLoading: isLoadingDeleteProperty }] = useDeletePropertyMutation();

    const handleFavoriteClick = async (id, isFavorite) => {        
        try {
            if(isFavorite === true) {
                const response = await deleteFavorite(Number(id)).unwrap();
                await Promise.all([
                    refetchDetails(),
                    refetchListing(),
                ]);
                showNotification.success(response?.message || 'Favorite updated successfully');
            } else{
                const response = await addFavorite(Number(id)).unwrap();
                await Promise.all([
                    refetchDetails(),
                    refetchListing(),
                ]);
                showNotification.success(response?.message || 'Favorite updated successfully');
            }
        } catch (error) {
            console.error("Error:", error);
            showNotification.error(error.data?.message || 'Failed to update favorite');
        }
    };

    const handleDeleteClick = async (id) => {        
        try {
            const response = await deleteProperty(Number(id)).unwrap();
            refetchListing();
            navigate('/properties');
            showNotification.success(response?.message || 'Favorite updated successfully');
        } catch (error) {
            console.error("Error:", error);
            showNotification.error(error.data?.message || 'Failed to update favorite');
        }
    };

    const handleEditClick = (id) => {
        navigate(`/sell?id=${id}`);
    };

    console.log(singleProperty?.isFavorite);

    return (
        <div className="col-span-12 md:col-span-7">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <Text className="!text-2xl !font-bold">{singleProperty?.title}</Text>
                    <Text className="!text-gray-700 !font-semibold !flex !items-center !gap-2"> <FiMapPin /> {`${getCountryFromGoogleMapsUrl(singleProperty?.location)}, ${singleProperty?.locationType}`}</Text>
                    {singleProperty?.hasOffer ? (
                        <div className='flex items-center gap-2 mt-4'>
                            <IoPricetagsOutline />
                            <Text className='!text-gray-500 !text-base !font-medium !line-through'>{singleProperty?.price} EGP</Text>
                            <Text className='!text-red-400 !text-lg !font-semibold'>{singleProperty?.priceAfterDiscount}</Text>
                        </div>
                    ) : (
                        <div className='flex items-center gap-2 mt-4'>
                            <IoPricetagsOutline />
                            <Text className='!text-black !text-lg !font-bold'>{singleProperty?.price} EGP</Text>
                        </div>
                    )}
                </div>
                <div className={`flex items-center justify-end gap-4 ${singleProperty?.userId === userChecked?.id ? "flex-wrap" : ""} `}>
                    <div className="flex items-center gap-4">
                        <Badge 
                            className="!bg-transparent !text-black !border !border-gray-400 !rounded-full !w-10 !h-10 !cursor-pointer"
                            onClick={() => setIsShareModalOpen(true)}
                        >
                            <FaShare size={18} />
                        </Badge>
                        <div 
                            className={`!border !border-gray-300 !rounded-full !w-10 !h-10 !flex !justify-center !items-center !cursor-pointer hover:!bg-gray-100 ${
                                singleProperty?.isFavorite ? '!border-red-500' : ''
                            }`}
                            onClick={() => handleFavoriteClick(singleProperty?.id, singleProperty?.isFavorite)}
                            disabled={isLoadingAddFavorite || isLoadingDeleteFavorite}                        
                        >
                            {singleProperty?.isFavorite ? (
                                <IoIosHeart size={22} className="text-red-500" />
                            ) : (
                                <IoIosHeartEmpty size={22} />
                            )}
                        </div>
                    </div>
                    
                    {/* Add edit and delete icons conditionally */}
                    {singleProperty?.userId === userChecked?.id && (
                        <div className="flex items-center gap-4">
                            <div 
                                className="!border !border-gray-300 !rounded-full !w-10 !h-10 !flex !justify-center !items-center !cursor-pointer hover:!bg-gray-100"
                                onClick={() => handleEditClick(singleProperty?.id)} 
                            >
                                <FiEdit size={18} color="#1F4B43"/> 
                            </div>
                            <Button 
                                className="!bg-transparent !border !border-gray-300 !rounded-full !w-10 !h-10 !flex !justify-center !items-center !cursor-pointer hover:!bg-gray-100"
                                onClick={() => handleDeleteClick(singleProperty?.id)}
                                disabled ={isLoadingDeleteProperty}
                                loading ={isLoadingDeleteProperty}
                                loaderProps ={{color: "#1F4B43"}}
                            >
                                <FiTrash2 size={18} color="red" /> 
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-14 border border-gray-400 rounded-xl">
                <div className="text-left p-3">
                    <Text size="sm" color="dimmed" fw={500}>Bedroom</Text>
                    <Group className="mt-2 !flex !items-center !justify-start">
                        <PiBedFill size={24} className='!text-gray-400'/>
                        <Text fw={700}>{numberToWords(singleProperty?.rooms)}</Text>
                    </Group>
                </div>
                <div className="text-left border-l-2 border-gray-300 pl-4 p-3">
                    <Text size="sm" color="dimmed" fw={500}>Bathroom</Text>
                    <Group className="mt-2 !flex !items-center !justify-start">
                        <PiBathtubFill size={24} className='!text-gray-400'/>
                        <Text fw={700}>{numberToWords(singleProperty?.bathrooms)}</Text>
                    </Group>
                </div>
                <div className="text-left border-l-2 border-gray-300 pl-4 p-3">
                    <Text size="sm" color="dimmed" fw={500}>Area</Text>
                    <Group className="mt-2 !flex !items-center !justify-start">
                        <PiTriangleFill size={24} className='!text-gray-400'/>
                        <Text fw={700}>{`${singleProperty?.area} m²`}</Text>
                    </Group>
                </div>
            </div>

            {/* Description */}
            <div className="my-16">
                <Text className="!font-bold !text-xl !mb-4">Description</Text>
                <Text className="!text-base !font-semibold">
                    {singleProperty?.description}                     
                </Text>
            </div>
    </div>
    )
}

export default LeftCard