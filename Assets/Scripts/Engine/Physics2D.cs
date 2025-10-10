using System;
public static class Physics2D
{
	public const int MAX_LAYERS = 64;
	public const int oo = unchecked((1 << 31) - 1);
	public const float oof = unchecked((1 << 31) - 1);
	public const float Epsilon = 1e-32f; //uses Equalsf for float equality comparisons
	public const float DEGREES = (float)Math.PI / 180f;
	public static Collider2D? OverlapBox(Vector2 center, Vector2 size, String layer, float angle = 0f, float minDepth = -oof, float maxDepth = oof)
	{
		GameObject boundingBox = new GameObject();
		float radius = size.Length()/2;
		float theta = (float)Math.Atan(size.y/size.x);
		Vector2 A = new Vector2(center.x + (radius*(float)Math.Cos(theta+angle)), center.y + (radius*(float)Math.Sin(theta+angle)));
		Vector2 B = new Vector2(center.x + (radius*(float)Math.Cos(theta+(Math.PI-angle))), center.y + (radius*(float)Math.Sin(theta+(Math.PI-angle))));
		Vector2 C = new Vector2(center.x + (radius*(float)Math.Cos(theta+(Math.PI+angle))), center.y + (radius*(float)Math.Sin(theta+(Math.PI+angle))));
		Vector2 D = new Vector2(center.x + (radius*(float)Math.Cos(theta+((2*Math.PI)-angle))), center.y + (radius*(float)Math.Sin(theta+((2*Math.PI)-angle))));
		PolygonCollider2D pcol = new PolygonCollider2D(new List<Triangle>{new Triangle(A,B,C), new Triangle(D,B,C)});
		boundingBox.addUpdater(pcol);
		//#pragma warning disable CS8602, CS8604
		foreach(GameObject obj in GameLoop.gameObjects)
		{
			Collider2D? col = obj.GetComponent<Collider2D>();
			if(((obj.physicsLayerMask & (1L << (int)Enum.Parse(typeof(PhysicsLayers),layer))) != 0) && (obj.transform.position.z >= minDepth && obj.transform.position.z <= maxDepth) && col!=null && pcol.Collide(col))
			{
				return obj.GetComponent<Collider2D>();
			}
		}
		//#pragma warning restore CS8602, CS8604
		return null;
	}
	public static List<Triangle> Triangulate(List<Vector2> mesh) //assumes that the points of the polygon are ordered anticlockwise
	{
		if(mesh.Count < 3)
		{
			Console.WriteLine("ERROR: Failed to triangulate mesh!");
			return new List<Triangle>();
		}
		if(mesh.Count == 3)return new List<Triangle>{new Triangle(mesh[0], mesh[1], mesh[2])};
		for(int i=0; i<mesh.Count; ++i)
		{
			if(CrossProduct(mesh[(i+1)%mesh.Count] - mesh[i%mesh.Count], mesh[(i+2)%mesh.Count] - mesh[(i+1)%mesh.Count]) >= 0)
			{
				mesh.RemoveAt((i+1)%mesh.Count);
				List<Triangle>triangles = Triangulate(mesh);
				triangles.Add(new Triangle(mesh[i%mesh.Count], mesh[(i+1)%mesh.Count], mesh[(i+2)%mesh.Count]));
				return triangles;
			}
		}
		Console.WriteLine("ERROR: Failed to triangulate mesh!");
		return new List<Triangle>();
	}
	public static float DotProduct(Vector3 a, Vector3 b)
	{
		return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
	}
	public static float CrossProduct(Vector2 a, Vector2 b)
	{
		return (a.x * b.y) - (a.y * b.x);
	}
	public static float AngleBetween(Vector3 a, Vector3 b)
	{
		float cosTheta = DotProduct(a, b)            / (a.Length() * b.Length());
		float sinTheta = CrossProduct(a, b).Length() / (a.Length() * b.Length());
		if (cosTheta >= 0 && sinTheta >= 0) return (float)Math.Asin(sinTheta);
		else if (cosTheta < 0 && sinTheta >= 0) return (float)Math.Acos(cosTheta);
		else if (cosTheta <= 0 && sinTheta < 0) return (float)(Math.PI - Math.Asin(sinTheta));
		else return (float)((2 * Math.PI) - Math.Acos(cosTheta));
	}
	public static Vector3 CrossProduct(Vector3 a, Vector3 b)
	{
		return new Vector3((a.y * b.z) - (a.z * b.y), -(a.x * b.z) + (a.z * b.x), (a.x * b.y) - (a.y * b.x));
	}
	public static bool SegmentIntersect2D(Vector2 A, Vector2 B, Vector2 C, Vector2 D)
	{
		if(A==B||C==D)
		{
			//may be true but the constructor for Triangle() prevents this
			Console.WriteLine("ERROR: Triangle with zero area!");
			System.Environment.Exit(-1);
			return false;
		}
		//Cramer (solve $a+\lambda(b-a)=c+\mu(d-c)$)
		float Det  = CrossProduct(new Vector2(B.x - A.x, B.y - A.y), new Vector2(C.x - D.x, C.y - D.y));
		float Det1 = CrossProduct(new Vector2(C.x - A.x, C.y - A.y), new Vector2(C.x - D.x, C.y - D.y));
		float Det2 = CrossProduct(new Vector2(B.x - A.x, B.y - A.y), new Vector2(C.x - A.x, C.y - A.y));
		if(Math.Abs(Det).EQ(0)) //Parallel
		{
			//Test for overlapping segments (4 endpoints)
			//set Lambda := 0
			float mu_0;
			if((D.x-C.x).NEQ(0)&&(D.y-C.y).NEQ(0))
			{
				mu_0 = (A.x-C.x)/(D.x-C.x);
				if(mu_0.NEQ((A.y-C.y)/(D.y-C.y)))return false;
			}
			else
			{
				if((D.x-C.x).NEQ(0))mu_0 = (A.x-C.x)/(D.x-C.x);
				else mu_0 = (A.y-C.y)/(D.y-C.y); //since $C \neq D$
				if((mu_0*(D.x-C.x)).NEQ(A.x-C.x)||(mu_0*(D.y-C.y)).NEQ(A.y-C.y))return false;
			}

			//set Mu := 0
			float lambda_0;
			if((A.x-B.x).NEQ(0)&&(A.y-B.y).NEQ(0))
			{
				lambda_0 = (A.x-C.x)/(A.x-B.x);
				if(lambda_0.NEQ((A.y-C.y)/(A.y-B.y)))return false;
			}
			else
			{
				if((A.x-B.x).NEQ(0))lambda_0 = (A.x-C.x)/(A.x-B.x);
				else lambda_0 = (A.y-C.y)/(A.y-B.y); //since $C \neq D$
				if((lambda_0*(A.x-B.x)).NEQ(A.x-C.x)||(lambda_0*(A.y-B.y)).NEQ(A.y-C.y))return false;
			}

			//set Lambda := 1
			float mu_1;
			if((D.x-C.x).NEQ(0)&&(D.y-C.y).NEQ(0))
			{
				mu_1 = (B.x-C.x)/(D.x-C.x);
				if(mu_1.NEQ((B.y-C.y)/(D.y-C.y)))return false;
			}
			else
			{
				if((D.x-C.x).NEQ(0))mu_1 = (B.x-C.x)/(D.x-C.x);
				else mu_1 = (B.y-C.y)/(D.y-C.y); //since $C \neq D$
				if((mu_1*(D.x-C.x)).NEQ(B.x-C.x)||(mu_1*(D.y-C.y)).NEQ(B.y-C.y))return false;
			}

			//set Mu := 1
			float lambda_1;
			if((A.x-B.x).NEQ(0)&&(A.y-B.y).NEQ(0))
			{
				lambda_1 = (A.x-D.x)/(A.x-B.x);
				if(lambda_1.NEQ((A.y-D.y)/(A.y-B.y)))return false;
			}
			else
			{
				if((A.x-B.x).NEQ(0))lambda_1 = (A.x-D.x)/(A.x-B.x);
				else lambda_1 = (A.y-D.y)/(A.y-B.y); //since $C \neq D$
				if((lambda_1*(A.x-B.x)).NEQ(A.x-D.x)||(lambda_1*(A.y-B.y)).NEQ(A.y-D.y))return false;
			}

			if((mu_0+Epsilon>=0)&&(mu_0-Epsilon<=1))return true;
			if((lambda_0+Epsilon>=0)&&(lambda_0-Epsilon<=1))return true;
			if((mu_1+Epsilon>=0)&&(mu_1-Epsilon<=1))return true;
			if((lambda_1+Epsilon>=0)&&(lambda_1-Epsilon<=1))return true;
			return false; //non-collinear or collinear disjoint
		}
		float Lambda = Det1 / Det;
		float Mu     = Det2 / Det;
		if((Lambda+Epsilon<0)||(Lambda-Epsilon>1))return false;
		if((Mu+Epsilon<0)||(Mu-Epsilon>1))return false;
		return true;
	}
	public static bool PointInTriangle(Vector2 P, Triangle ABC)
	{
		Triangle PBC = new Triangle(P,ABC.B,ABC.C);
		Triangle PCA = new Triangle(ABC.A,P,ABC.C);
		Triangle PAB = new Triangle(ABC.A,ABC.B,P);
		if((PBC.Area()+PCA.Area()+PAB.Area()).EQ(ABC.Area()))return true;
		return false;
	}
	public static bool OverlapTriangles2D(Triangle t1, Triangle t2)
	{
		//Case 1: Triangle Contains Vertex
		if(PointInTriangle(t1.A,t2)||PointInTriangle(t1.B,t2)||PointInTriangle(t1.C,t2))return true;
		if(PointInTriangle(t2.A,t1)||PointInTriangle(t2.B,t1)||PointInTriangle(t2.C,t1))return true;

		//Case 2: Two Edges Intersect
		if(SegmentIntersect2D(t1.A,t1.B,t2.A,t2.B))return true;
		if(SegmentIntersect2D(t1.A,t1.B,t2.B,t2.C))return true;
		if(SegmentIntersect2D(t1.A,t1.B,t2.C,t2.A))return true;

		if(SegmentIntersect2D(t1.B,t1.C,t2.A,t2.B))return true;
		if(SegmentIntersect2D(t1.B,t1.C,t2.B,t2.C))return true;
		if(SegmentIntersect2D(t1.B,t1.C,t2.C,t2.A))return true;
		
		if(SegmentIntersect2D(t1.C,t1.A,t2.A,t2.B))return true;
		if(SegmentIntersect2D(t1.C,t1.A,t2.B,t2.C))return true;
		if(SegmentIntersect2D(t1.C,t1.A,t2.C,t2.A))return true;
		
		return false;
	}
}