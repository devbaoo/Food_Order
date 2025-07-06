interface Preferences {
    activityLevel: number;
    cafeFreq: string;
    concerns?: string[];
    cuisinePrefs?: string[];
    dietType?: string[];
    feeling?: string[];
    foodRegions?: string[];
    ingredients?: string[];
    meals?: string[];
    medicalConcerns?: string[];
    outsideEating: number;
    saltiness: string;
    spicyLevel: number;
}

export function generatePromptFromPreferences(preferences: Preferences) {
    const {
        activityLevel,
        cafeFreq,
        concerns = [],
        cuisinePrefs = [],
        dietType = [],
        feeling = [],
        foodRegions = [],
        ingredients = [],
        meals = [],
        medicalConcerns = [],
        outsideEating,
        saltiness,
        spicyLevel,
    } = preferences;

    return `Hãy đề xuất một thực đơn hoặc món ăn phù hợp với các yêu cầu sau:
- Mức độ vận động: ${activityLevel ?? 0} / 5
- Cà phê: ${cafeFreq ?? ""}
- Mối quan tâm: ${concerns.join(", ")}
- Ưu tiên ẩm thực: ${cuisinePrefs.join(", ")}
- Chế độ ăn: ${dietType.join(", ")}
- Cảm giác hiện tại: ${feeling.join(", ")}
- Yêu thích món từ vùng: ${foodRegions.join(", ")}
- Tránh các thành phần: ${ingredients.join(", ")}
- Thói quen ăn uống: ${meals.join(", ")}
- Vấn đề sức khỏe: ${medicalConcerns.join(", ")}
- Tần suất ăn ngoài: khoảng ${outsideEating ?? 0} lần mỗi tuần
- Mức độ mặn: ${saltiness ?? ""}
- Mức độ cay: ${spicyLevel ?? 0} / 5`;
}