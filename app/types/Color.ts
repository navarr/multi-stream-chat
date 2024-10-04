export interface Color {
    lightMode: RedGreenBlueAlpha,
    darkMode: RedGreenBlueAlpha
}

export interface RedGreenBlueAlpha {
    red: number,
    green: number,
    blue: number,
    alpha: number
}