import React, { useState, useMemo } from 'react';
import { Instructor } from '../types';
import { InstructorCard } from './InstructorCard';
import { 
  Users, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  MapPin, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface InstructorSectionProps {
  instructors: Instructor[];
  onSelectDetail: (instructor: Instructor) => void;
  onApplyWithInstructor: (instructor: Instructor) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  openAiMatchModal: () => void;
}

export const InstructorSection: React.FC<InstructorSectionProps> = ({
  instructors,
  onSelectDetail,
  onApplyWithInstructor,
  searchQuery,
  setSearchQuery,
  openAiMatchModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'lectures' | 'reviews'>('rating');

  const categories = [
    { id: 'all', label: '전체 분야' },
    { id: 'generative-ai', label: '🤖 생성형 AI & 프롬프트' },
    { id: 'senior-digital', label: '📱 시니어 스마트폰' },
    { id: 'youth-coding', label: '👶 청소년 코딩 & 메이커' },
    { id: 'media-video', label: '🎥 영상 AI & 숏폼' },
    { id: 'business-marketing', label: '💼 소상공인 마케팅' },
    { id: 'culture-art', label: '🎨 AI 문화예술 아트' },
    { id: 'digital-ethics', label: '🛡️ 디지털 윤리 & 보안' },
    { id: 'nocode-automation', label: '⚙️ 노코드 업무자동화' }
  ];

  const districtOptions = [
    { id: 'all', label: '서울시 전체' },
    { id: '도심권', label: '도심권 (종로/중구/용산)' },
    { id: '강남권', label: '강남권 (강남/서초/송파/강동)' },
    { id: '서북권', label: '서북권 (마포/서대문/은평)' },
    { id: '서남권', label: '서남권 (영등포/구로/금천/양천)' },
    { id: '동북권', label: '동북권 (노원/도봉/강북/성북)' },
    { id: '온라인', label: '온라인 (Zoom)' }
  ];

  const filteredInstructors = useMemo(() => {
    return instructors
      .filter((inst) => {
        // Category filter
        if (selectedCategory !== 'all' && inst.category !== selectedCategory) {
          return false;
        }

        // District filter
        if (selectedDistrict !== 'all') {
          const matchDist = inst.districts.some(d => 
            d === selectedDistrict || 
            d === '서울 전역' || 
            selectedDistrict.includes(d) ||
            d.includes(selectedDistrict)
          );
          if (!matchDist) return false;
        }

        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = inst.name.toLowerCase().includes(q);
          const matchTitle = inst.title.toLowerCase().includes(q);
          const matchBio = inst.shortBio.toLowerCase().includes(q) || inst.fullBio.toLowerCase().includes(q);
          const matchTags = inst.portfolioTags.some(t => t.toLowerCase().includes(q));
          const matchTopics = inst.featuredTopics.some(t => t.toLowerCase().includes(q));
          return matchName || matchTitle || matchBio || matchTags || matchTopics;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'lectures') return b.lectureCount - a.lectureCount;
        if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
        return 0;
      });
  }, [instructors, selectedCategory, selectedDistrict, searchQuery, sortBy]);

  return (
    <section id="instructors-section" className="py-14 sm:py-20 bg-slate-50/60 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 text-xs font-bold">
            <Users className="w-3.5 h-3.5" />
            <span>서울시 공인 인증 시민강사 풀(Pool)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            내 모임·기관에 딱 맞는 서울시민강사를 만나보세요
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            서울특별시 평생학습원 엄격한 역량 심사를 거쳐 위촉된 공인 강사진입니다. <br className="hidden sm:inline" />
            강사별 프로필, 상세 커리큘럼, 실제 수강생 만족도를 확인하고 바로 강의를 신청할 수 있습니다.
          </p>
        </div>

        {/* Filters and Search toolbar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs mb-8 space-y-4">
          {/* Top row: search + district + sort */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="강사명, 키워드(예: 챗GPT, 스마트폰, 캔바, 보이스피싱, 마케팅)로 검색..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* District select */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="bg-transparent focus:outline-none font-semibold cursor-pointer"
                >
                  {districtOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Sort by */}
              <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent focus:outline-none font-semibold cursor-pointer"
                >
                  <option value="rating">수강만족도 높은순</option>
                  <option value="lectures">누적출강 많은순</option>
                  <option value="reviews">리뷰 많은순</option>
                </select>
              </div>
            </div>
          </div>

          {/* Categories chip list */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 scrollbar-none pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results summary bar */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-500 px-1">
          <div>
            검색 결과 총 <strong className="text-blue-600 font-bold">{filteredInstructors.length}명</strong>의 서울시민강사 활동 중
          </div>
          <button
            onClick={openAiMatchModal}
            className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg font-bold border border-emerald-200/80 cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>어떤 강사가 좋을지 고민되시나요? AI 맞춤 추천받기</span>
          </button>
        </div>

        {/* Instructors grid */}
        {filteredInstructors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredInstructors.map((inst) => (
              <InstructorCard
                key={inst.id}
                instructor={inst}
                onSelectDetail={onSelectDetail}
                onApplyWithInstructor={onApplyWithInstructor}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
              🔍
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              조건에 맞는 서울시민강사를 찾을 수 없습니다.
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              검색어나 지역 필터를 변경해 보시거나, 서울시 평생교육과로 문의하시면 적합한 강사를 직접 매칭해 드립니다.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDistrict('all');
              }}
              className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 cursor-pointer"
            >
              필터 초기화
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
