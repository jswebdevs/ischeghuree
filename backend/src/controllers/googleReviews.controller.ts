import { Request, Response } from 'express';
import axios from 'axios';
import prisma from '../config/prisma';

interface CachedReviews {
  fetchedAt: number;
  payload: any;
}

let cache: CachedReviews | null = null;
const TTL_MS = 1000 * 60 * 60 * 6;

export const getGoogleReviews = async (_req: Request, res: Response): Promise<void> => {
  try {
    if (cache && Date.now() - cache.fetchedAt < TTL_MS) {
      res.json({ success: true, cached: true, data: cache.payload });
      return;
    }

    const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
    const apiKey = settings?.googleApiKey || process.env.GOOGLE_PLACES_API_KEY;
    const placeId = settings?.googlePlaceId || process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
      res.json({
        success: true,
        configured: false,
        message: 'Google Reviews not configured. Set googleApiKey + googlePlaceId in site settings, or GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID env vars.',
        data: { reviews: [], rating: null, total: 0 },
      });
      return;
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json`;
    const { data } = await axios.get(url, {
      params: {
        place_id: placeId,
        fields: 'name,rating,user_ratings_total,reviews,url',
        key: apiKey,
      },
      timeout: 10_000,
    });

    if (data.status !== 'OK') {
      res.status(502).json({
        success: false,
        message: `Google API returned ${data.status}: ${data.error_message || 'unknown error'}`,
      });
      return;
    }

    const result = data.result || {};
    const payload = {
      name: result.name,
      rating: result.rating,
      total: result.user_ratings_total || 0,
      googleUrl: result.url,
      reviews: (result.reviews || []).map((r: any) => ({
        author: r.author_name,
        avatar: r.profile_photo_url,
        rating: r.rating,
        text: r.text,
        relativeTime: r.relative_time_description,
        time: r.time,
      })),
    };

    cache = { fetchedAt: Date.now(), payload };
    res.json({ success: true, cached: false, data: payload });
  } catch (error: any) {
    console.error('Google Reviews error:', error?.message || error);
    res.status(500).json({ success: false, message: 'Failed to fetch Google reviews' });
  }
};
