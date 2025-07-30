# api_views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from ..models import ManualCodingLog
from ..serializers import ManualCodingLogSerializer
from django.shortcuts import get_object_or_404



class ManualCodingLogListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        sessions = ManualCodingLog.objects.filter(user=request.user)
        serializer = ManualCodingLogSerializer(sessions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ManualCodingLogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ManualCodingLogDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user):
        return get_object_or_404(ManualCodingLogSerializer, pk=pk, user=user)

    def get(self, request, pk):
        session = self.get_object(pk, request.user)
        serializer = ManualCodingLogSerializer(session)
        return Response(serializer.data)

    def put(self, request, pk):
        session = self.get_object(pk, request.user)
        serializer = ManualCodingLogSerializer(session, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(user=request.user)  # Ensure user stays unchanged
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        session = self.get_object(pk, request.user)
        session.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class DetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user):
        return get_object_or_404(ManualCodingLog, pk=pk, user=user)

    def get(self, request, pk):
        session = self.get_object(pk, request.user)
        serializer = ManualCodingLogSerializer(session)
        return Response(serializer.data)

    def put(self, request, pk):
        session = self.get_object(pk, request.user)
        serializer = ManualCodingLogSerializer(session, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(user=request.user)  # Ensure user stays unchanged
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        session = self.get_object(pk, request.user)
        session.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)