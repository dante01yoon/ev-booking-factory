import { describe, expect, it } from 'vitest';
import { searchStations } from '../../src/rules/search.js';

// 이슈 #1 / US-01 / T-09: 저장된 세 충전소를 재현 입력으로 고정한다.
// 검색 판정은 src/rules의 순수 함수로 제공되어야 한다.
// 현재 함수가 없어 모듈 로드 단계에서 실패하는 것이 재현 공정의 Red 결과다.
const stations = [
  { id: 'BNBN0821', name: '구로구 구로동 주차장-sk허브', address: '서울특별시 구로구 구로동 642-116' },
  { id: 'CGA00023', name: '마포 SK허브블루(B4F)', address: '서울특별시 마포구 마포대로 204' },
  { id: 'CGA00024', name: '마포 SK허브블루(B6F)', address: '서울특별시 마포구 마포대로 204' },
];

describe('이슈 #1 — 충전소 검색 대소문자', () => {
  it.each(['sk', 'SK'])('%s 검색 시 세 충전소 모두 반환한다', (query) => {
    const result = searchStations(stations, query);

    expect(result).toHaveLength(3);
    expect(result.map((station: { id: string }) => station.id).sort()).toEqual([
      'BNBN0821', 'CGA00023', 'CGA00024',
    ]);
  });
});
