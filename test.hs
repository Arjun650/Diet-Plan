intExample :: Int -> Int -> Int
intExample x y = x + y

integerExample :: Integer -> Integer -> Integer
integerExample x y = x * y

floatExample :: Float -> Float -> Float
floatExample x y = x / y

doubleExample :: Double -> Double -> Double
doubleExample x y = x ** y

charExample :: Char -> Char
charExample c = c

boolExample :: Bool -> Bool -> Bool
boolExample x y = x && y

main :: IO()
main = do
    print(intExample 10 20)
    print(integerExample 123456789 987654321)
    print(floatExample 7.5 2.5)
    print(doubleExample 2.0 3.0)
    print(charExample 'H')
    print(boolExample True False)