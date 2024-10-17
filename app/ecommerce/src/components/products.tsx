import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export type Product = {
    id: number,
    title: string,
    price: number,
    description: string,
    "category": string,
    "image": string,
    "rating": {
        "rate": number,
        "count": number
    }
}

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    
    useEffect(() => {
        async function getData() {
            const response = await fetch('https://fakestoreapi.com/products/');
            const data = await response.json();
            setProducts(data)
        }
        getData()
    });

    return (
        <Box display={'flex'} flexDirection={'row'}flexWrap={'wrap'}>
            {
                products.map((product, i) => 
                    <Card key={i} sx={{width: '500px', height: '500px'}} >
                        <Typography overflow={'clip'} variant="h6">
                            {product.title}
                        </Typography>
                        <img src={product.image} width={'300px'} height={'300px'}/>
                        <CardContent>
                            Hello
                        </CardContent>
                    </Card>
                )
            }
        </Box>
    )
}