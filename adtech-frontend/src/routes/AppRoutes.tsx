import { Routes, Route } from 'react-router-dom';
import { CampaignList } from '../pages/CampaignList';
import { CampaignCreate } from '../pages/CampaignCreate';
import { CampaignDetail } from '../pages/CampaignDetail';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CampaignList />} />
      <Route path="/campaigns/new" element={<CampaignCreate />} />
      <Route path="/campaigns/:id" element={<CampaignDetail />} />
    </Routes>
  );
}


