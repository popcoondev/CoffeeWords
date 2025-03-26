import { useState } from 'react';
import { useCoffeeRecordStore } from '../store/useCoffeeRecordStore';
import { coffeeRecordAPI, aiAPI } from '../services/api';
import { useAuth } from './useAuth';
import { CoffeeRecord } from '../types';

export const useCoffeeRecord = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordId, setRecordId] = useState<string | null>(null);
  
  const { user } = useAuth();
  
  const {
    name,
    roaster,
    photoURL,
    body,
    flavor,
    aftertaste,
    languageResult,
    tags,
    setName,
    setRoaster,
    setPhotoURL,
    setBody,
    setFlavor,
    setAftertaste,
    setLanguageResult,
    setTags,
    reset,
  } = useCoffeeRecordStore();

  // 写真のアップロード
  const uploadPhoto = async (imageUri: string): Promise<string | null> => {
    if (!user) {
      setError('ユーザーがログインしていません');
      return null;
    }
    
    try {
      const url = await coffeeRecordAPI.uploadImage(user.id, imageUri);
      setPhotoURL(url);
      return url;
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      setError(error.message || '写真のアップロードに失敗しました');
      return null;
    }
  };

  // AI言語化の生成
  const generateLanguage = async (): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      
      const responses = {
        body,
        flavor,
        aftertaste,
      };
      
      const result = await aiAPI.generateLanguage(responses);
      
      setLanguageResult(result.text);
      setTags(result.tags);
      
      return true;
    } catch (error: any) {
      console.error('Error generating language:', error);
      setError(error.message || '言語化の生成に失敗しました');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // 記録の保存
  const saveRecord = async (): Promise<string | null> => {
    if (!user) {
      setError('ユーザーがログインしていません');
      return null;
    }
    
    try {
      setIsSubmitting(true);
      
      const recordData: Omit<CoffeeRecord, 'id' | 'userId' | 'createdAt'> = {
        coffeeInfo: {
          name,
          roaster,
          photoURL,
        },
        responses: {
          body,
          flavor,
          aftertaste,
        },
        languageResult,
        tags,
      };
      
      const newRecordId = await coffeeRecordAPI.createRecord(user.id, recordData);
      setRecordId(newRecordId);
      
      return newRecordId;
    } catch (error: any) {
      console.error('Error saving record:', error);
      setError(error.message || '記録の保存に失敗しました');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // フォームのリセット
  const resetForm = () => {
    reset();
    setError(null);
    setRecordId(null);
  };

  return {
    // 状態
    isSubmitting,
    error,
    recordId,
    
    // フォームの値
    name,
    roaster,
    photoURL,
    body,
    flavor,
    aftertaste,
    languageResult,
    tags,
    
    // フォームの更新関数
    setName,
    setRoaster,
    setPhotoURL,
    setBody,
    setFlavor,
    setAftertaste,
    setLanguageResult,
    setTags,
    
    // アクション
    uploadPhoto,
    generateLanguage,
    saveRecord,
    resetForm,
    reset  // フォームを完全にリセットするZustandの直接的な関数も含める
  };
};